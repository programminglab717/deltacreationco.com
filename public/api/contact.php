<?php

/**
 * Contact form endpoint (POST /api/contact.php, JSON body).
 *
 * Validates the enquiry, filters spam (honeypot, time-trap, link limit,
 * per-IP rate limit, same-origin check), emails it to you with Reply-To set
 * to the visitor, and optionally sends the visitor an auto-reply.
 * Settings: see config.example.php. Requires PHP 8.1+.
 */

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailerException;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/_lib/PHPMailer/Exception.php';
require __DIR__ . '/_lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/_lib/PHPMailer/SMTP.php';

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 600;
const ACCENT = '#ff5a1f';

/* ---------------------------------------------------------------- */
/* Helpers                                                          */
/* ---------------------------------------------------------------- */

function respond(int $status, array $body, array $headers = []): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    foreach ($headers as $name => $value) {
        header("$name: $value");
    }
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function load_config(): array
{
    $defaults = [
        'smtp' => ['host' => '', 'port' => 465, 'secure' => 'ssl', 'username' => '', 'password' => ''],
        'from' => ['address' => '', 'name' => 'Delta Creation Co.'],
        'to' => '',
        'autoreply' => true,
        'public_reply_to' => '',
        'site' => [
            'name' => 'Delta Creation Co.',
            'url' => 'https://deltacreationco.com',
            'email' => 'hello@deltacreationco.com',
            'time_zone' => 'America/New_York',
            'response_time' => 'within one business day',
        ],
    ];
    foreach ([dirname(__DIR__, 2) . '/contact-config.php', __DIR__ . '/config.php'] as $file) {
        if (is_file($file)) {
            $config = require $file;
            return is_array($config) ? array_replace_recursive($defaults, $config) : $defaults;
        }
    }
    return $defaults;
}

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/** Rejects cross-site requests when the browser sends an Origin header. */
function is_same_origin(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return true;
    }
    $originHost = parse_url($origin, PHP_URL_HOST);
    $originPort = parse_url($origin, PHP_URL_PORT);
    $host = $_SERVER['HTTP_HOST'] ?? '';
    return is_string($originHost) && strcasecmp($originHost . ($originPort ? ":$originPort" : ''), $host) === 0;
}

/** Sliding-window limit per IP, stored in a small JSON file in the temp dir. */
function rate_limit(string $key): ?int
{
    $file = sys_get_temp_dir() . '/dcc-contact-rate-limit.json';
    $handle = @fopen($file, 'c+');
    if (!$handle) {
        return null; // Never block a real lead because the temp dir is unavailable.
    }
    flock($handle, LOCK_EX);
    $buckets = json_decode(stream_get_contents($handle) ?: '{}', true) ?: [];
    $now = time();
    foreach ($buckets as $k => $hits) {
        $buckets[$k] = array_values(array_filter($hits, fn ($t) => $now - $t < RATE_WINDOW_SECONDS));
        if (!$buckets[$k]) {
            unset($buckets[$k]);
        }
    }
    $id = hash('sha256', $key);
    $hits = $buckets[$id] ?? [];
    $retryAfter = null;
    if (count($hits) >= RATE_LIMIT) {
        $retryAfter = RATE_WINDOW_SECONDS - ($now - $hits[0]);
    } else {
        $buckets[$id] = [...$hits, $now];
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($buckets));
    flock($handle, LOCK_UN);
    fclose($handle);
    return $retryAfter;
}

function str_field(array $data, string $key, int $max): string
{
    $value = $data[$key] ?? '';
    return is_string($value) ? mb_substr(trim($value), 0, $max) : '';
}

function len(string $value): int
{
    return mb_strlen($value);
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function one_line(string $value): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $value));
}

function first_name(string $name): string
{
    return preg_split('/\s+/', trim($name))[0] ?? $name;
}

/** @param array<string, string> $t */
function touch_summary(?array $t): ?string
{
    if (!$t) {
        return null;
    }
    $parts = array_filter([
        !empty($t['utm_source']) ? "source={$t['utm_source']}" : null,
        !empty($t['utm_medium']) ? "medium={$t['utm_medium']}" : null,
        !empty($t['utm_campaign']) ? "campaign={$t['utm_campaign']}" : null,
        !empty($t['utm_term']) ? "term={$t['utm_term']}" : null,
        !empty($t['gclid']) ? 'Google Ads click' : null,
        !empty($t['fbclid']) ? 'Meta click' : null,
        !empty($t['msclkid']) ? 'Microsoft Ads click' : null,
        !empty($t['referrer']) ? "referrer={$t['referrer']}" : null,
        !empty($t['landing_page']) ? "landed on {$t['landing_page']}" : null,
    ]);
    return $parts ? implode(' · ', $parts) : 'Direct / unknown';
}

/** Keeps only short string values from an attribution touch. */
function clean_touch(mixed $t): ?array
{
    if (!is_array($t)) {
        return null;
    }
    $out = [];
    foreach ($t as $k => $v) {
        if (is_string($k) && is_string($v) && $v !== '') {
            $out[$k] = mb_substr(trim($v), 0, 300);
        }
    }
    return $out ?: null;
}

/* ---------------------------------------------------------------- */
/* Email templates                                                  */
/* ---------------------------------------------------------------- */

/** @param list<array{0: string, 1: ?string, 2?: array{html?: bool, pre?: bool}}> $rows */
function rows_html(array $rows): string
{
    $html = '';
    foreach ($rows as $row) {
        [$label, $value] = $row;
        $opts = $row[2] ?? [];
        if ($value === null || trim($value) === '') {
            continue;
        }
        $v = !empty($opts['html']) ? $value : e($value);
        $pre = !empty($opts['pre']) ? 'white-space:pre-wrap;' : '';
        $html .= '<tr>'
            . '<td style="padding:12px 0;border-bottom:1px solid #eeeae4;width:150px;vertical-align:top;color:#77737d;font-size:13px;">' . e($label) . '</td>'
            . '<td style="padding:12px 0;border-bottom:1px solid #eeeae4;vertical-align:top;color:#16151a;font-size:14px;line-height:1.55;' . $pre . '">' . $v . '</td>'
            . '</tr>';
    }
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #eeeae4;">' . $html . '</table>';
}

function rows_text(array $rows): string
{
    $lines = [];
    foreach ($rows as $row) {
        [$label, $value] = $row;
        if ($value === null || trim($value) === '') {
            continue;
        }
        $lines[] = $label . ': ' . (!empty($row[2]['html']) ? strip_tags($value) : $value);
    }
    return implode("\n", $lines);
}

function button(string $href, string $label): string
{
    return '<a href="' . e($href) . '" style="display:inline-block;background:' . ACCENT . ';color:#060607;text-decoration:none;font-weight:600;font-size:14px;padding:13px 22px;border-radius:999px;">' . e($label) . '</a>';
}

function layout(array $site, string $preheader, string $eyebrow, string $title, string $body, string $intro = ''): string
{
    $host = preg_replace('#^https?://#', '', $site['url']);
    $introHtml = $intro !== '' ? '<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4d4a55;">' . $intro . '</p>' : '';
    $accent = ACCENT;
    $name = e($site['name']);
    $siteUrl = e($site['url']);
    $hostE = e($host);
    $titleE = e($title);
    $preheaderE = e($preheader);
    $eyebrowE = e($eyebrow);
    return <<<HTML
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>{$titleE}</title></head>
<body style="margin:0;padding:0;background:#f2f0eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#16151a;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">{$preheaderE}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0eb;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td style="padding:0 8px 18px;font-size:15px;font-weight:700;letter-spacing:-0.02em;color:#16151a;">
          <span style="color:{$accent};">&#9650;</span>&nbsp; {$name}
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:20px;padding:36px 32px;border:1px solid #e8e5de;">
          <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:{$accent};font-weight:700;">{$eyebrowE}</p>
          <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;letter-spacing:-0.02em;color:#16151a;">{$titleE}</h1>
          {$introHtml}
          {$body}
        </td></tr>
        <tr><td style="padding:20px 8px 0;font-size:12px;line-height:1.6;color:#8a8691;">
          {$name} · <a href="{$siteUrl}" style="color:#8a8691;">{$hostE}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

function contact_notification(array $site, array $d): array
{
    $subject = one_line("New enquiry: {$d['name']}" . ($d['company'] !== '' ? " ({$d['company']})" : '') . ' · ' . implode(', ', $d['interests']));
    $roi = $d['roi']
        ? '~' . number_format($d['roi']['hours']) . ' hours / $' . number_format($d['roi']['savings']) . ' per year (calculator)'
        : null;
    $rows = [
        ['Name', $d['name']],
        ['Email', '<a href="mailto:' . e($d['email']) . '" style="color:' . ACCENT . ';">' . e($d['email']) . '</a>', ['html' => true]],
        ['Company', $d['company']],
        ['Website', $d['siteUrl']],
        ['Interested in', implode(', ', $d['interests'])],
        ['Budget', $d['budget']],
        ['Timeline', $d['timeline']],
        ['Message', $d['message'], ['pre' => true]],
        ['ROI estimate', $roi],
        ['Received', $d['submittedAt']],
    ];
    $meta = [
        ['Submitted from', $d['page']],
        ['First touch', touch_summary($d['attribution']['first'])],
        ['Latest touch', touch_summary($d['attribution']['last'])],
    ];
    $replyHref = 'mailto:' . $d['email'] . '?subject=' . rawurlencode("Re: your enquiry to {$site['name']}");

    $html = layout(
        $site,
        mb_substr($d['message'], 0, 140),
        'New website enquiry',
        "New enquiry from {$d['name']}",
        rows_html($rows)
            . '<p style="margin:28px 0 8px;">' . button($replyHref, 'Reply to ' . first_name($d['name'])) . '</p>'
            . '<p style="margin:28px 0 8px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8691;font-weight:700;">Attribution</p>'
            . rows_html($meta),
    );
    $text = "New website enquiry\n\n" . rows_text($rows) . "\n\nAttribution\n" . rows_text($meta) . "\n";
    return [$subject, $html, $text];
}

function contact_auto_reply(array $site, string $name): array
{
    $subject = "Thanks for reaching out to {$site['name']}";
    $bookUrl = rtrim($site['url'], '/') . '/book/';
    $first = first_name($name);
    $html = layout(
        $site,
        "We've received your message and will reply {$site['response_time']}.",
        'Message received',
        "We've got your message",
        '<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#4d4a55;">Want to move faster? Pick a time for a free 30-minute strategy call and we\'ll come prepared with ideas.</p>'
            . '<p style="margin:22px 0 0;">' . button($bookUrl, 'Book a free strategy call') . '</p>',
        'Hi ' . e($first) . ', thanks for getting in touch. Your message is with us and we\'ll reply ' . e($site['response_time']) . '.',
    );
    $text = "Hi {$first},\n\nThanks for getting in touch. Your message is with us and we'll reply {$site['response_time']}.\n\n"
        . "Want to move faster? Book a free 30-minute strategy call: {$bookUrl}\n\n{$site['name']}";
    return [$subject, $html, $text];
}

/* ---------------------------------------------------------------- */
/* Mail                                                             */
/* ---------------------------------------------------------------- */

/**
 * @param array{0: string, 1?: string} $to
 * @param array{0: string, 1?: string} $replyTo
 * @throws MailerException
 */
function send_mail(array $config, array $to, array $replyTo, string $subject, string $html, string $text): void
{
    $smtp = $config['smtp'];
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $smtp['host'];
    $mail->Port = (int) $smtp['port'];
    $mail->SMTPAuth = $smtp['username'] !== '';
    $mail->Username = $smtp['username'];
    $mail->Password = $smtp['password'];
    $mail->SMTPSecure = match ($smtp['secure']) {
        'ssl' => PHPMailer::ENCRYPTION_SMTPS,
        'tls' => PHPMailer::ENCRYPTION_STARTTLS,
        default => '',
    };
    $mail->SMTPAutoTLS = $smtp['secure'] !== '';
    $mail->Timeout = 15;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    $from = $config['from']['address'] ?: $smtp['username'] ?: $config['site']['email'];
    $mail->setFrom($from, $config['from']['name']);
    $mail->addAddress($to[0], $to[1] ?? '');
    $mail->addReplyTo($replyTo[0], $replyTo[1] ?? '');
    $mail->Subject = $subject;
    $mail->isHTML(true);
    $mail->Body = $html;
    $mail->AltBody = $text;
    $mail->send();
}

/* ---------------------------------------------------------------- */
/* Request                                                          */
/* ---------------------------------------------------------------- */

$config = load_config();
$site = $config['site'];
$fallback = "Something went wrong sending your message. Please email us directly at {$site['email']}.";

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.'], ['Allow' => 'POST']);
}
if (!is_same_origin()) {
    respond(403, ['ok' => false, 'error' => 'Forbidden.']);
}

$retryAfter = rate_limit('contact:' . client_ip());
if ($retryAfter !== null) {
    respond(429, ['ok' => false, 'error' => "You've sent a few messages already. Please try again in a few minutes."], ['Retry-After' => (string) $retryAfter]);
}

if (!str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
    respond(415, ['ok' => false, 'error' => 'Expected JSON.']);
}
$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'Request too large.']);
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'Invalid JSON.']);
}

// Validate (mirrors the checks in the contact form UI).
$d = [
    'name' => str_field($data, 'name', 200),
    'email' => str_field($data, 'email', 300),
    'company' => str_field($data, 'company', 120),
    'siteUrl' => str_field($data, 'siteUrl', 200),
    'interests' => array_values(array_filter(
        array_map(fn ($v) => is_string($v) ? mb_substr(trim($v), 0, 100) : '', is_array($data['interests'] ?? null) ? array_slice($data['interests'], 0, 10) : []),
    )),
    'budget' => str_field($data, 'budget', 100),
    'timeline' => str_field($data, 'timeline', 100),
    'message' => is_string($data['message'] ?? null) ? trim($data['message']) : '',
    'roi' => null,
    'page' => str_field($data, 'page', 300),
    'attribution' => [
        'first' => clean_touch($data['attribution']['first'] ?? null),
        'last' => clean_touch($data['attribution']['last'] ?? null),
    ],
];
$roi = $data['roi'] ?? null;
if (is_array($roi) && is_numeric($roi['hours'] ?? null) && is_numeric($roi['savings'] ?? null)) {
    $d['roi'] = [
        'hours' => max(0, min(1_000_000, (float) $roi['hours'])),
        'savings' => max(0, min(100_000_000, (float) $roi['savings'])),
    ];
}

$fields = [];
if (len($d['name']) < 2) {
    $fields['name'] = 'Please enter your name.';
} elseif (len($d['name']) > 100) {
    $fields['name'] = 'That name is a little long.';
}
if (len($d['email']) > 200 || !filter_var($d['email'], FILTER_VALIDATE_EMAIL)) {
    $fields['email'] = 'Please enter a valid email address.';
}
if (!$d['interests']) {
    $fields['interests'] = 'Choose at least one option.';
}
if (len($d['message']) < 10) {
    $fields['message'] = 'Please add a few more details (at least 10 characters).';
} elseif (len($d['message']) > 5000) {
    $fields['message'] = 'Please keep your message under 5,000 characters.';
}
if ($fields) {
    respond(400, ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $fields]);
}

// Spam: answer like a success so bots learn nothing, but send nothing.
$honeypot = $data['website'] ?? '';
$startedAt = $data['startedAt'] ?? null;
$spam = (is_string($honeypot) && trim($honeypot) !== '')
    || (is_numeric($startedAt) && microtime(true) * 1000 - (float) $startedAt < 2500)
    || preg_match_all('#https?://#i', $d['message']) > 4;
if ($spam) {
    error_log('[contact] dropped spam submission');
    respond(200, ['ok' => true]);
}

if ($config['smtp']['host'] === '' || ($config['to'] ?: $config['smtp']['username']) === '') {
    error_log('[contact] mailer is not configured; see api/config.example.php');
    respond(503, ['ok' => false, 'error' => $fallback]);
}

try {
    $tz = new DateTimeZone($site['time_zone']);
} catch (Exception) {
    $tz = new DateTimeZone('UTC');
}
$d['submittedAt'] = (new DateTimeImmutable('now', $tz))->format('M j, Y, g:i A') . " ({$tz->getName()})";

try {
    [$subject, $html, $text] = contact_notification($site, $d);
    send_mail($config, [$config['to'] ?: $config['smtp']['username']], [$d['email'], one_line($d['name'])], $subject, $html, $text);
} catch (MailerException $error) {
    error_log('[contact] failed to send enquiry email: ' . $error->getMessage());
    respond(502, ['ok' => false, 'error' => $fallback]);
}

if ($config['autoreply']) {
    try {
        [$subject, $html, $text] = contact_auto_reply($site, $d['name']);
        send_mail($config, [$d['email'], one_line($d['name'])], [$config['public_reply_to'] ?: $site['email']], $subject, $html, $text);
    } catch (MailerException $error) {
        error_log('[contact] failed to send auto-reply: ' . $error->getMessage());
    }
}

respond(200, ['ok' => true]);
