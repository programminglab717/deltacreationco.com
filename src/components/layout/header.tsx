"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { getLenis } from "@/components/motion/smooth-scroll";
import { ButtonLink } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import type { NavItem } from "@/content/navigation";
import { cn } from "@/lib/utils";

export type NavService = {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  category: "development" | "automation";
};

type Props = {
  nav: NavItem[];
  services: NavService[];
  categories: Record<string, { label: string }>;
  email: string;
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ nav, services, categories, email }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const closeTimer = useRef<number | undefined>(undefined);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close menus whenever the route changes (including back/forward).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setMegaOpen(false);
  }

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (Math.abs(y - lastY) > 8) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scrolling and make the page inert behind the mobile menu.
  useEffect(() => {
    const main = document.getElementById("main");
    const footer = document.getElementById("site-footer");
    if (menuOpen) {
      getLenis()?.stop();
      document.documentElement.style.overflow = "hidden";
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
    }
    return () => {
      getLenis()?.start();
      document.documentElement.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen(false);
      if (menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };

  const [servicesItem, ...otherItems] = nav;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[var(--ease-out-expo)]",
          hidden && !menuOpen && !megaOpen && "-translate-y-[calc(100%+3rem)]",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "glass absolute inset-0 border-x-0 border-t-0 transition-opacity duration-500",
            scrolled && !menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="relative container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label="Delta Creation Co. home" className="relative z-10 rounded-md">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 text-[0.92rem]">
              <li className="relative flex items-center" onMouseEnter={openMega} onMouseLeave={closeMega}>
                <Link
                  href={servicesItem.href}
                  aria-current={isActive(pathname, servicesItem.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full py-2 pr-1 pl-4 transition-colors",
                    isActive(pathname, servicesItem.href) ? "text-fog-100" : "text-fog-300 hover:text-fog-100",
                  )}
                >
                  {servicesItem.label}
                </Link>
                <button
                  type="button"
                  aria-label="Show services"
                  aria-expanded={megaOpen}
                  aria-controls="mega-services"
                  onClick={() => setMegaOpen((v) => !v)}
                  className="grid size-8 place-items-center rounded-full text-fog-300 hover:text-fog-100"
                >
                  <ChevronDown
                    className={cn("size-4 transition-transform duration-500", megaOpen && "rotate-180")}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id="mega-services"
                  data-open={megaOpen}
                  className={cn(
                    "absolute top-full left-1/2 w-[min(56rem,calc(100vw-4rem))] -translate-x-[28%] pt-4 transition-all duration-500 ease-[var(--ease-out-expo)]",
                    megaOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
                  )}
                >
                  <div className="glass grid grid-cols-[1fr_1fr_16rem] gap-2 rounded-3xl !bg-ink-900/95 p-3 shadow-2xl shadow-black/60">
                    {(["development", "automation"] as const).map((cat) => (
                      <div key={cat} className="p-3">
                        <p className="eyebrow eyebrow-plain mb-3 px-3">{categories[cat].label}</p>
                        <ul className="space-y-1">
                          {services
                            .filter((s) => s.category === cat)
                            .map((s) => (
                              <li key={s.slug}>
                                <Link
                                  href={`/services/${s.slug}`}
                                  onClick={() => setMegaOpen(false)}
                                  className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-white/[0.05]"
                                >
                                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-fog-200 transition-colors group-hover:border-accent/50 group-hover:text-accent">
                                    <Icon name={s.icon} className="size-[18px]" />
                                  </span>
                                  <span>
                                    <span className="block text-[0.92rem] font-medium text-fog-100">{s.name}</span>
                                    <span className="mt-0.5 block text-[0.8rem] leading-snug text-fog-400">
                                      {s.short}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                    <Link
                      href="/book"
                      onClick={() => setMegaOpen(false)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-accent p-5 text-ink-950"
                    >
                      <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase opacity-70">
                        Not sure where to start?
                      </span>
                      <span>
                        <span className="block text-xl leading-tight font-semibold tracking-tight">
                          Book a free 30-min strategy call
                        </span>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                          Pick a time
                          <ArrowUpRight
                            className="size-4 transition-transform duration-500 group-hover:rotate-45"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute -right-8 -bottom-10 size-32 rounded-full bg-white/25 blur-2xl transition-transform duration-700 group-hover:scale-150"
                      />
                    </Link>
                  </div>
                </div>
              </li>
              {otherItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 transition-colors",
                      isActive(pathname, item.href) ? "text-fog-100" : "text-fog-300 hover:text-fog-100",
                    )}
                  >
                    {item.label}
                    {isActive(pathname, item.href) && (
                      <span className="absolute inset-x-4 -bottom-0.5 h-px bg-accent" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <ButtonLink href="/book" size="sm" icon className="hidden sm:inline-flex">
              Book a call
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              className="group grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.03] lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={cn(
                    "absolute top-0 left-0 h-[1.5px] w-5 rounded bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    menuOpen && "translate-y-[5.25px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-5 rounded bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    menuOpen && "-translate-y-[5.25px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} nav={nav} services={services} email={email} onNavigate={() => setMenuOpen(false)} />
    </>
  );
}

function MobileMenu({
  open,
  nav,
  services,
  email,
  onNavigate,
}: {
  open: boolean;
  nav: NavItem[];
  services: NavService[];
  email: string;
  onNavigate: () => void;
}) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink-950 pt-[var(--header-h)] transition-[clip-path] duration-[900ms] ease-[var(--ease-in-out-quart)] lg:hidden",
        open ? "[clip-path:circle(150%_at_calc(100%-44px)_38px)]" : "[clip-path:circle(0%_at_calc(100%-44px)_38px)]",
      )}
      data-lenis-prevent
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-60" />
      <nav aria-label="Mobile" className="relative container-x flex flex-1 flex-col justify-between gap-10 py-8">
        <ul className="space-y-1">
          {nav.map((item, i) => (
            <li
              key={item.href}
              className={cn(
                "transition-all duration-700 ease-[var(--ease-out-expo)]",
                open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
              )}
              style={{ transitionDelay: open ? `${180 + i * 60}ms` : "0ms" }}
            >
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex items-baseline gap-4 py-2 text-[2.6rem] leading-none font-medium tracking-[-0.045em]"
              >
                <span className="font-mono text-xs tracking-normal text-fog-500">0{i + 1}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className={cn(
            "grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-fog-300 transition-opacity duration-700",
            open ? "opacity-100 delay-500" : "opacity-0",
          )}
        >
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} onClick={onNavigate} className="py-1 hover:text-fog-100">
              {s.name}
            </Link>
          ))}
        </div>

        <div
          className={cn(
            "flex flex-col gap-4 transition-all duration-700",
            open ? "translate-y-0 opacity-100 delay-500" : "translate-y-4 opacity-0",
          )}
        >
          <ButtonLink href="/book" size="lg" icon className="w-full" onClick={onNavigate}>
            Book a free strategy call
          </ButtonLink>
          <a href={`mailto:${email}`} className="text-center text-sm text-fog-300 hover:text-fog-100">
            {email}
          </a>
        </div>
      </nav>
    </div>
  );
}
