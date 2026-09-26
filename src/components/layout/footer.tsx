import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StudioClock } from "@/components/layout/studio-clock";
import { BackToTop } from "@/components/layout/back-to-top";
import { Logo } from "@/components/ui/logo";
import { socialIcons, socialLabels } from "@/components/ui/social-icons";
import { legalNav } from "@/content/navigation";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { solutions } from "@/content/solutions";

const company = [
  { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Book a call", href: "/book" },
];

export function Footer() {
  const socials = Object.entries(site.socials).filter(([, url]) => url);
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-white/[0.07] bg-ink-950">
      <div className="container-x">
        <Link
          href="/contact"
          className="group flex flex-col gap-6 border-b border-white/[0.07] py-16 md:flex-row md:items-end md:justify-between md:py-24"
          data-cursor="Let's talk"
        >
          <span>
            <span className="eyebrow">Have a project in mind?</span>
            <span className="mt-5 block text-display font-medium">
              Let&apos;s talk<span className="text-accent">.</span>
            </span>
          </span>
          <span className="grid size-20 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950 md:size-28">
            <ArrowUpRight className="size-8 md:size-10" strokeWidth={1.4} aria-hidden="true" />
          </span>
        </Link>

        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
          <div className="flex flex-col gap-8">
            <Link href="/" aria-label="Delta Creation Co. home" className="w-fit">
              <Logo />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-fog-400">
              A development &amp; automation studio building high-converting websites, custom software and AI-powered
              automations for growing businesses.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline w-fit text-lg font-medium tracking-tight text-fog-100"
            >
              {site.email}
            </a>
            <StudioClock />
          </div>

          <FooterColumn
            title="Services"
            links={services.map((s) => ({ label: s.name, href: `/services/${s.slug}` }))}
          />
          <FooterColumn
            title="Solutions"
            links={solutions.map((s) => ({ label: s.name, href: `/solutions/${s.slug}` }))}
          />
          <FooterColumn title="Company" links={company} />
        </div>

        <div className="flex flex-col gap-6 border-t border-white/[0.07] py-8 text-sm text-fog-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName} All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {legalNav.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-fog-100">
                {l.label}
              </Link>
            ))}
            {socials.length > 0 && (
              <ul className="flex items-center gap-2">
                {socials.map(([key, url]) => {
                  const SocialIcon = socialIcons[key];
                  return (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialLabels[key] ?? key}
                        className="grid size-9 place-items-center rounded-full border border-white/10 hover:border-white/30 hover:text-fog-100"
                      >
                        {SocialIcon ? <SocialIcon className="size-4" /> : key}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
            <BackToTop />
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none relative -mb-[2.5vw] overflow-hidden select-none">
        <p className="text-center text-mega font-semibold text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.09)]">
          Delta Creation
        </p>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow eyebrow-plain mb-5">{title}</p>
      <ul className="space-y-3 text-[0.95rem]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-fog-300 transition-colors hover:text-fog-100">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
