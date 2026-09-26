# Delta Creation Co. — website

Marketing website for **Delta Creation Co.**, a development & automation studio. Built for organic growth and
conversions: fast static pages, rich SEO, interactive "live" demos, a built-in meeting scheduler and a contact form
that emails every lead straight to your inbox.

- **Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis
  smooth scrolling · Zod · Nodemailer
- **Rendering:** every page is statically pre-rendered; only the three API routes run on the server.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in SMTP + FocusPilot settings
npm run dev                  # http://localhost:3000
```

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Local development server              |
| `npm run build`   | Production build (type-checks too)    |
| `npm run start`   | Serve the production build            |
| `npm run lint`    | ESLint                                |
| `npm run format`  | Prettier (with Tailwind class sorting) |

Without SMTP/FocusPilot credentials, the forms still work locally: submissions are logged to the terminal instead of
being sent. In production, missing configuration returns a friendly error with your email address, so no lead is ever
silently lost.

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
| `/book`              | Meeting scheduler → FocusPilot task + calendar invites                  |
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

## Contact form → your inbox (Nodemailer)

`POST /api/contact` validates the submission (Zod), filters spam (honeypot, time-trap, link limits, per-IP rate
limit, same-origin check) and emails a formatted enquiry to `CONTACT_TO_EMAIL` with **Reply-To set to the visitor**, so
you can answer with one click. Each email includes lead attribution (UTM source, referrer, landing page) and any ROI
calculator estimate. Optionally, visitors get an automatic confirmation (`CONTACT_AUTOREPLY=true`).

Gmail setup: enable 2-Step Verification, create an [App Password](https://myaccount.google.com/apppasswords), then use
`SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER=<gmail>`, `SMTP_PASS=<app password>`.
Any SMTP provider works (Google Workspace, Microsoft 365, Zoho, Postmark, SES…).

## Meeting bookings → FocusPilot

`GET /api/availability` generates open slots from the rules in `src/content/booking.ts` (studio time zone, working
hours, minimum notice, booking window). Visitors see times in their own time zone and can switch zones.

`POST /api/booking` re-validates the slot, then:

1. **Creates a task in FocusPilot** for the meeting (title, full details, due date = meeting start).
2. Emails you a notification with an `.ics` calendar file (`BOOKING_NOTIFY_OWNER`).
3. Emails the visitor a confirmation with a calendar invite and your meeting link (`BOOKING_MEETING_URL`).

If FocusPilot is unreachable, the owner email acts as a safety net, so the booking is never lost.

All FocusPilot request details (endpoint, auth header, payload fields) live in **`src/lib/focuspilot.ts`**.

## SEO & performance

- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards
- Generated, branded social images for every page (`opengraph-image.tsx`)
- JSON-LD structured data: Organization, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting, ItemList
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, RSS feed at `/blog/rss.xml`, and `/llms.txt` for AI assistants
- Static pre-rendering, self-hosted fonts, no layout-shifting images, lazy-loaded booking calendar
- Accessibility: semantic landmarks, skip link, keyboard-friendly menus, visible focus states, form error
  announcements and full `prefers-reduced-motion` support

After launch: verify the domain in Google Search Console and Bing Webmaster Tools and submit
`https://deltacreationco.com/sitemap.xml`.

## Analytics (optional)

Set one of `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Conversion events
are sent automatically: `generate_lead` (contact form), `book_appointment` (booking), plus `booking_slot_selected`,
`roi_cta_click` and `playground_run`. If you add Google Analytics for EU visitors, add a consent banner.

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended): import the repository, add the environment variables from
`.env.example`, and point `deltacreationco.com` at the project. Any Node.js host that runs `next start` also works.

## Launch checklist

- [ ] Confirm `email`, `timeZone`, `hours` and `socials` in `src/content/site.ts`
- [ ] Confirm booking hours in `src/content/booking.ts`
- [ ] Add SMTP, FocusPilot and meeting-link environment variables, then send a test enquiry and booking
- [ ] Review copy (commitments such as response times) and the legal pages
- [ ] Add real case studies/testimonials as they become available
- [ ] Connect analytics and Google Search Console

## Project structure

```
content/blog/           Markdown articles
src/app/                Routes, metadata files, API routes
src/components/         layout/, sections/, motion/, booking/, forms/, blog/, ui/, seo/
src/content/            Site copy and configuration
src/lib/                Email, FocusPilot, booking engine, SEO helpers, validation, utilities
```
