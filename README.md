# Delta Creation Co. — website

Marketing website for **Delta Creation Co.**, a development & automation studio. Built for organic growth and
conversions: fast static pages, rich SEO, interactive "live" demos, an inline FocusPilot booking calendar and a
contact form that emails every lead straight to your inbox.

It's a **static site**: `npm run build` writes plain HTML/CSS/JS to `dist/`. There's no Node.js server to run. The
only server-side piece is one small PHP file for the contact form, so it runs on ordinary shared hosting (Hostinger).

- **Stack:** Next.js 16 (App Router, Turbopack, `output: "export"`) · React 19 · TypeScript · Tailwind CSS 4 · GSAP +
  ScrollTrigger · Lenis smooth scrolling
- **Rendering:** every page, feed and social image is pre-rendered at build time.
- **Contact form:** `public/api/contact.php` + [PHPMailer](https://github.com/PHPMailer/PHPMailer) 6.12 (bundled)
- **Bookings:** FocusPilot booking embed

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: site URL, analytics
npm run dev                  # http://localhost:3000
```

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Local development server              |
| `npm run build`   | Static build into `dist/` (type-checks too) |
| `npm run preview` | Serve `dist/` locally to check the build |
| `npm run preview:php` | Serve `dist/` with PHP so the contact form works locally (needs PHP 8.1+) |
| `npm run lint`    | ESLint                                |
| `npm run format`  | Prettier (with Tailwind class sorting) |

The contact form needs PHP, so it doesn't send under `npm run dev`. Test it with `npm run build && npm run
preview:php` and a `dist/api/config.php` (see below). If the mailer isn't configured or sending fails, visitors see a
friendly error with your email address, so no lead is ever silently lost.

## Pages

| Route                | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `/`                  | Home: hero with live automation console, services, workflow playground, ROI calculator, process, playbooks, insights, FAQ and an inline booking calendar |
| `/services`          | Services overview + engagement models                                  |
| `/services/[slug]`   | 5 service landing pages (websites, web apps, workflow automation, AI agents, integrations) |
| `/solutions`         | Automation playbooks                                                    |
| `/solutions/[slug]`  | 6 playbook pages, each with a live, runnable workflow demo              |
| `/about`             | Story, mission, beliefs, process                                        |
| `/contact`           | Qualifying contact form → email                                          |
| `/book`              | FocusPilot booking calendar                                              |
| `/blog`, `/blog/[slug]` | Insights (Markdown in `content/blog`) with table of contents and RSS  |
| `/privacy`, `/terms` | Legal pages                                                             |

## Editing content

Almost everything is plain data. No code changes needed for copy updates.

| What                                     | Where                           |
| ---------------------------------------- | ------------------------------- |
| Business name, email, time zone, hours, socials | `src/content/site.ts`    |
| Services (copy, deliverables, FAQs, SEO) | `src/content/services.ts`       |
| Automation playbooks + demo workflows    | `src/content/solutions.ts`      |
| Process, principles, home FAQ, commitments | `src/content/company.ts`      |
| Booking embed URL + meeting copy (availability lives in FocusPilot) | `src/content/booking.ts` |
| Contact form options (budgets, timelines) | `src/content/forms.ts`         |
| Navigation                               | `src/content/navigation.ts`     |
| Blog posts                               | `content/blog/*.md` (front-matter: title, description, date, category, tags, relatedServices) |

In headings, wrap words in `*asterisks*` to render them in the italic accent font, e.g.
`"Put your busywork on *autopilot*."`

## Contact form → your inbox (PHP + PHPMailer)

`POST /api/contact.php` validates the submission, filters spam (honeypot, time-trap, link limits, per-IP rate limit,
same-origin check) and emails a formatted enquiry to your inbox with **Reply-To set to the visitor**, so you can answer
with one click. Each email includes lead attribution (UTM source, referrer, landing page) and any ROI calculator
estimate. Visitors get an automatic confirmation too (`autoreply`).

The PHP lives in `public/api/` and is copied into `dist/api/` on build. PHPMailer is bundled in `public/api/_lib/`, so
there's no Composer step. Requires PHP 8.1+ with `mbstring` and `openssl` (standard on Hostinger).

**Settings (SMTP password etc.) are never committed.** Copy `public/api/config.example.php` to one of:

1. `contact-config.php` in the folder **above** your web root (recommended). On Hostinger that's
   `domains/deltacreationco.com/contact-config.php`, next to `public_html/`. Nothing there is reachable from the web.
2. `api/config.php` inside the web root. `.htaccess` blocks access to it, and it prints nothing if requested anyway.

Hostinger mailbox: `smtp.hostinger.com`, port `465`, `secure` = `ssl`, the full email address as the username and the
mailbox password. Errors are written to the PHP error log (hPanel → Advanced → PHP error logs).

To point the form somewhere else, set `NEXT_PUBLIC_CONTACT_ENDPOINT` before building (defaults to `/api/contact.php`).

## Bookings → FocusPilot

The booking calendar on `/book` and the home page is FocusPilot's inline embed (`src/components/booking/`). FocusPilot
handles availability, creates the meeting and sends the confirmation emails, so the site holds no FocusPilot API key.
Change the booking page or its accent colour via `embedUrl` in `src/content/booking.ts`.

The calendar loads only when it's about to scroll into view. If `embed.js` can't load (an ad blocker, or offline),
visitors get a link to open the booking page directly, or to email you instead.

## SEO & performance

- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards
- Generated, branded social images for every page (`opengraph-image.tsx`)
- JSON-LD structured data: Organization, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting, ItemList
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, RSS feed at `/blog/rss.xml`, and `/llms.txt` for AI assistants
- Fully static output, self-hosted fonts, no layout-shifting images, lazy-loaded booking calendar
- Accessibility: semantic landmarks, skip link, keyboard-friendly menus, visible focus states, form error
  announcements and full `prefers-reduced-motion` support

After launch: verify the domain in Google Search Console and Bing Webmaster Tools and submit
`https://deltacreationco.com/sitemap.xml`.

## Analytics (optional)

Set one of `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Conversion events
are sent automatically: `generate_lead` (contact form), plus `roi_cta_click` and `playground_run`. Bookings happen
inside the FocusPilot embed, so track them from FocusPilot. If you add Google Analytics for EU visitors, add a consent banner.

## Deployment (Hostinger)

```bash
npm run build   # → dist/
```

1. In hPanel, make sure the domain's **SSL certificate is active**. `.htaccess` redirects every request to HTTPS.
2. Upload the **contents** of `dist/` into `public_html/` (File Manager: upload a zip and extract it, or use FTP).
   Include the hidden `.htaccess` files. When updating, replace the old files so stale ones don't linger.
3. Create `contact-config.php` next to `public_html/` from `public/api/config.example.php`, with your mailbox
   password.
4. Send a test enquiry from `/contact/` and make a test booking on `/book/`. Then submit
   `https://deltacreationco.com/sitemap.xml` in Google Search Console.

`public/.htaccess` (Apache/LiteSpeed) redirects to `https://` without `www`, and sets security headers, compression,
long-term caching for hashed assets, and the 404 page. It also blocks the PHP config and library files.

URLs end in a slash (`/about/` → `about/index.html`), and canonical URLs, the sitemap and the RSS feed use the same
form, so search engines never hit a redirect. Use `pageUrl()` from `src/content/site.ts` for absolute page links.

The pages also work on any static host (Netlify, Cloudflare Pages, nginx…) using `public/_headers` or your own server
config. Only the contact form needs PHP.

## Launch checklist

- [ ] Confirm `email`, `timeZone`, `hours` and `socials` in `src/content/site.ts`
- [ ] Confirm availability and confirmation emails in FocusPilot
- [ ] Add `contact-config.php` on the server, then send a test enquiry and booking
- [ ] Review copy (commitments such as response times) and the legal pages
- [ ] Add real case studies/testimonials as they become available
- [ ] Connect analytics and Google Search Console

## Project structure

```
content/blog/           Markdown articles
src/app/                Routes and metadata files
src/components/         layout/, sections/, motion/, booking/, forms/, blog/, ui/, seo/
src/content/            Site copy and configuration
public/                 Copied into dist/: .htaccess, _headers, api/contact.php (+ bundled PHPMailer)
src/lib/                SEO helpers, time and attribution utilities
```
