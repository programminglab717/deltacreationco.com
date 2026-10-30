import type { CSSProperties } from "react";
import { ProductActions, ProductCard, ProductStage, StatusBadge } from "@/components/products/product-parts";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { productDeliveryLabel, products } from "@/content/products";

/** Home page: the studio's own products, led by a featured one. */
export function ProductsShowcase() {
  const [featured, ...rest] = products;

  return (
    <section
      id="products"
      className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-ink-900 section-y md:-mt-16 md:rounded-t-[4rem]"
      aria-labelledby="products-heading"
    >
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            id="products-heading"
            eyebrow="Our products"
            title="We build our own *products, too.*"
            titleClassName="max-w-[14ch]"
          />
          <div className="flex flex-col items-start gap-5 lg:items-end" data-reveal>
            <p className="max-w-md text-lead text-fog-400 lg:text-right">
              Software we design, ship and run ourselves. Download the apps, or open the web products on their own{" "}
              <span className="text-fog-200">deltacreationco.com</span> subdomain.
            </p>
            <ButtonLink href="/products" variant="ghost" size="sm">
              All products
            </ButtonLink>
          </div>
        </div>

        <article
          className="mt-16 grid items-center gap-10 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-950 p-6 sm:p-10 lg:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:p-12"
          style={{ "--product": featured.color } as CSSProperties}
          data-reveal
        >
          <div className="order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={featured.status} />
              <span className="font-mono text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">
                {featured.category}
              </span>
            </div>
            <h3 className="mt-6 text-h2 font-medium">{featured.name}</h3>
            <p className="mt-3 text-xl tracking-tight text-fog-200">{featured.tagline}</p>
            <p className="mt-4 max-w-[46ch] text-fog-400">{featured.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {featured.highlights.map((h) => (
                <li key={h} className="rounded-full border border-white/10 px-3 py-1 text-xs text-fog-300">
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <ProductActions product={featured} />
            </div>
            <p className="mt-4 text-sm text-fog-500">{productDeliveryLabel(featured)}</p>
          </div>
          <ProductStage product={featured} className="order-1 p-4 sm:p-8 lg:order-2" />
        </article>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {rest.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
