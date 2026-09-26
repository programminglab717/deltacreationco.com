import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { HeroTitle } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const links = [
  { label: "Services", href: "/services" },
  { label: "Automation solutions", href: "/solutions" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[90svh] items-center overflow-hidden pt-[calc(var(--header-h)+3rem)] pb-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-50" />
        <p className="absolute -right-[5vw] bottom-0 text-[38vw] leading-none font-semibold tracking-[-0.08em] text-outline select-none">
          404
        </p>
      </div>
      <div className="container-x">
        <p className="hero-fade eyebrow">Error 404</p>
        <HeroTitle text="This page took a *wrong turn.*" className="mt-6 max-w-[12ch] text-h1 font-medium" />
        <p className="hero-fade mt-8 max-w-md text-lead text-fog-300">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="hero-fade mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" icon>
            Back to home
          </ButtonLink>
          <ButtonLink href="/book" variant="ghost">
            Book a call
          </ButtonLink>
        </div>
        <ul className="hero-fade mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-fog-400">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="link-underline hover:text-fog-100">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
