<?php

/**
 * Contact form mailer settings. Copy this file to ONE of:
 *
 *   1. contact-config.php in the folder ABOVE your web root (recommended),
 *      e.g. on Hostinger: domains/deltacreationco.com/contact-config.php
 *      next to public_html/. It is never reachable from the web there.
 *   2. config.php next to contact.php (public_html/api/config.php).
 *      Access is blocked by .htaccess, and the file prints nothing anyway.
 *
 * Never commit the real file: it holds your mailbox password.
 */

return [
    // Outgoing mail server. Hostinger email: smtp.hostinger.com, port 465, 'ssl',
    // and the full mailbox address + password as the login.
    'smtp' => [
        'host' => 'smtp.hostinger.com',
        'port' => 465,
        'secure' => 'ssl', // 'ssl' (port 465), 'tls' (port 587) or '' (none)
        'username' => 'hello@deltacreationco.com',
        'password' => '',
    ],

    // Sender shown on outgoing emails. Must be a mailbox your SMTP login may send as.
    'from' => [
        'address' => 'hello@deltacreationco.com',
        'name' => 'Delta Creation Co.',
    ],

    // Your private inbox for enquiries.
    'to' => 'hello@deltacreationco.com',

    // Send visitors an automatic "we got your message" email.
    'autoreply' => true,
    // Reply-to address on the auto-reply.
    'public_reply_to' => 'hello@deltacreationco.com',

    // Used in email copy and links.
    'site' => [
        'name' => 'Delta Creation Co.',
        'url' => 'https://deltacreationco.com',
        'email' => 'hello@deltacreationco.com',
        'time_zone' => 'America/New_York',
        'response_time' => 'within one business day',
    ],
];
