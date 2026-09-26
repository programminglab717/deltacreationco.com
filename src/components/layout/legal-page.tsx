import type { ReactNode } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { Breadcrumbs, HeroTitle } from "@/components/ui/page-hero";

export function LegalPage({
  title,
  path,
  updated,
  children,
}: {
  title: string;
  path: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <PageTransition>
      <section className="pt-[calc(var(--header-h)+3.5rem)] pb-28">
        <div className="container-narrow">
          <Breadcrumbs items={[{ name: title, path }]} />
          <HeroTitle text={title} className="mt-10 text-h1 font-medium" />
          <p className="hero-fade mt-6 font-mono text-xs tracking-[0.14em] text-fog-500 uppercase">
            Last updated: {updated}
          </p>
          <div className="prose-delta mt-14 max-w-[44rem]">{children}</div>
        </div>
      </section>
    </PageTransition>
  );
}
