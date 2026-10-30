# Delta Creation Co. — website

Marketing website for **Delta Creation Co.**, a development & automation studio. Built for organic growth and
conversions: fast static pages, rich SEO, interactive "live" demos, a built-in meeting scheduler and a contact form
that emails every lead straight to your inbox.

It's a **fully static site**: `npm run build` writes plain HTML/CSS/JS to `dist/`. There's no Node.js server to run;
upload `dist/` to any static host.

- **Stack:** Next.js 16 (App Router, Turbopack, `output: "export"`) · React 19 · TypeScript · Tailwind CSS 4 · GSAP +
  ScrollTrigger · Lenis smooth scrolling
- **Rendering:** every page, feed and social image is pre-rendered at build time. Forms post straight from the browser
  to a hosted form service (see below).

## Getting started

```bash
npm install
cp .env.example .env.local   # add your form endpoint + meeting link
npm run dev                  # http://localhost:3000
```

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Local development server              |
| `npm run build`   | Static build into `dist/` (type-checks too) |
| `npm run preview` | Serve `dist/` locally to check the build |
| `npm run lint`    | ESLint                                |
| `npm run format`  | Prettier (with Tailwind class sorting) |

Without a form endpoint, the forms still work in `npm run dev`: submissions are logged to the browser console instead of
being sent. In a production build, a missing endpoint shows a friendly error with your email address, so no lead is
ever silently lost.

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
| `/book`              | Meeting scheduler → email + calendar invites                            |
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
| Booking rules (hours, duration, notice, blackout dates) | `src/content/booking.ts` |
| Contact form options (budgets, timelines) | `src/content/forms.ts`         |
| Navigation                               | `src/content/navigation.ts`     |
| Blog posts                               | `content/blog/*.md` (front-matter: title, description, date, category, tags, relatedServices) |

In headings, wrap words in `*asterisks*` to render them in the italic accent font, e.g.
`"Put your busywork on *autopilot*."`

## Forms → your inbox

A static site has no server to send email, so the contact form and the booking calendar post their submissions as
JSON to a hosted form backend, which emails them to you. Any service that accepts JSON posts works:

| Service | `NEXT_PUBLIC_FORM_ENDPOINT` | `NEXT_PUBLIC_FORM_ACCESS_KEY` |
| ------- | --------------------------- | ----------------------------- |
| [Formspree](https://formspree.io) | `https://formspree.io/f/<form id>` | leave empty |
| [Web3Forms](https://web3forms.com) | `https://api.web3forms.com/submit` | your access key |
| Getform, Basin, FormKeep… | the form's endpoint URL | leave empty |

Every email has a clear subject, the visitor's details, and **Reply-To set to the visitor**, so you can answer with
one click. It also includes lead attribution (UTM source, referrer, landing page) and any ROI calculator estimate.
Spam is filtered in the browser (honeypot field, time-trap, link limits); turn on your form service's spam
protection too. Visitor auto-replies are configured in the form service.

`NEXT_PUBLIC_*` values are baked into the build, so set them before running `npm run build` (in `.env.local`, or in
your host's build settings).

All delivery code lives in **`src/lib/forms.ts`**.

## Meeting bookings

Open slots are generated in the visitor's browser from the rules in `src/content/booking.ts` (studio time zone,
working hours, minimum notice, booking window, blackout dates). Visitors see times in their own time zone and can
switch zones. A booking is emailed to you through the form service with both time zones. The visitor gets an `.ics`
download plus Google and Outlook calendar links, along with your meeting link (`NEXT_PUBLIC_BOOKING_MEETING_URL`).

There's no server-side calendar, so the widget can't see bookings already made. If two people pick the same slot,
reschedule one by email. To block days off, add them to `blackoutDates`.

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
are sent automatically: `generate_lead` (contact form), `book_appointment` (booking), plus `booking_slot_selected`,
`roi_cta_click` and `playground_run`. If you add Google Analytics for EU visitors, add a consent banner.

## Deployment

```bash
npm run build   # → dist/
```

Upload the contents of `dist/` to any static host: Netlify, Cloudflare Pages, GitHub Pages, S3 + CloudFront,
Vercel, or plain Apache/nginx/cPanel hosting. For hosts that build from Git, set the build command to
`npm run build`, the output directory to `dist` and add the `NEXT_PUBLIC_*` variables from `.env.example`.

URLs end in a slash (`/about/` → `dist/about/index.html`), so every host serves them without rewrite rules. Missing
pages use `dist/404.html`.

Security headers ship with the build for Netlify/Cloudflare Pages (`public/_headers`) and Apache
(`public/.htaccess`). On nginx, add the same headers to your server block, and serve the extension-less
`opengraph-image` and `apple-icon` files as `image/png`.

## Launch checklist

- [ ] Confirm `email`, `timeZone`, `hours` and `socials` in `src/content/site.ts`
- [ ] Confirm booking hours in `src/content/booking.ts`
- [ ] Set the form endpoint and meeting link, rebuild, then send a test enquiry and booking
- [ ] Review copy (commitments such as response times) and the legal pages
- [ ] Add real case studies/testimonials as they become available
- [ ] Connect analytics and Google Search Console

## Project structure

```
content/blog/           Markdown articles
src/app/                Routes and metadata files
src/components/         layout/, sections/, motion/, booking/, forms/, blog/, ui/, seo/
src/content/            Site copy and configuration
public/                 Host config (_headers, .htaccess) copied into dist/
src/lib/                Form delivery, booking engine, SEO helpers, utilities
```
