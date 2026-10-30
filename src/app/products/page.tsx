import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/layout/page-transition";
import { ProductActions, ProductStage, StatusBadge } from "@/components/products/product-parts";
import { CtaBooking } from "@/components/sections/cta-booking";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { productDeliveryLabel, products } from "@/content/products";
import { absoluteUrl } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn, pad } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Products: Software Built and Run by Delta Creation Co.",
  description:
    "Apps and web products from Delta Creation Co.: the Cutaway video editor, PVChat private chat rooms, the BizRetriever AI business analyst and more.",
  path: "/products",
});

export default function ProductsPage() {
  const live = products.filter((p) => p.status !== "in-development").length;
  const downloads = products.filter((p) => p.delivery.kind === "download").length;

  return (
    <PageTransition>
      <PageHero
        crumbs={[{ name: "Products", path: "/products" }]}
        eyebrow="Our products"
        title="Software we build, *ship and run.*"
        lead="Alongside client work, we make our own products. Some you download and install; the rest run in your browser on their own deltacreationco.com subdomain. Each gets the same care we put into client projects."
        aside={
          <dl className="surface grid grid-cols-3 overflow-hidden rounded-[2rem] bg-ink-900">
            {[
              { label: "Products", value: products.length },
              { label: "Live now", value: live },
              { label: "Desktop & mobile", value: downloads },
            ].map((item, i) => (
              <div
                key={item.label}
                className={cn("flex flex-col gap-2 p-6 sm:p-7", i > 0 && "border-l border-white/[0.07]")}
              >
                <dt className="font-mono text-[0.62rem] tracking-[0.14em] text-fog-500 uppercase">{item.label}</dt>
                <dd className="text-3xl font-medium tracking-tight text-fog-100">{pad(item.value)}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <nav aria-label="Products on this page">
          <ul className="flex flex-wrap gap-2">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`#${p.slug}`}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-white/12 px-4 text-sm text-fog-300 transition-colors hover:border-white/30 hover:text-fog-100"
                >
                  <span className="size-1.5 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section className="pb-24 md:pb-32" aria-label="All products">
        <div className="container-x flex flex-col gap-5">
          {products.map((product, i) => (
            <article
              key={product.slug}
              id={product.slug}
              className="grid scroll-mt-28 items-center gap-10 rounded-[2rem] border border-white/[0.08] bg-ink-900/60 p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14"
              style={{ "--product": product.color } as CSSProperties}
              aria-labelledby={`${product.slug}-name`}
              data-reveal
            >
              <div className={cn(i % 2 === 1 && "lg:order-2")}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-fog-500">{pad(i + 1)}</span>
                  <span className="h-px w-6 bg-white/15" aria-hidden="true" />
                  <span className="font-mono text-[0.68rem] tracking-[0.14em] text-fog-400 uppercase">
                    {product.category}
                  </span>
                </div>
                <h2
                  id={`${product.slug}-name`}
                  className="mt-6 flex flex-wrap items-baseline gap-x-4 text-h2 font-medium"
                >
                  {product.name}
                  {product.workingName && <span className="text-sm font-normal text-fog-500">working name</span>}
                </h2>
                <p className="mt-3 text-xl tracking-tight text-fog-200">{product.tagline}</p>
                <p className="mt-4 max-w-[50ch] text-fog-400">{product.description}</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <StatusBadge status={product.status} />
                  <span className="text-sm text-fog-400">{productDeliveryLabel(product)}</span>
                </div>
                <div className="mt-9">
                  <ProductActions product={product} />
                </div>
              </div>
              <ProductStage product={product} className={cn("p-4 sm:p-8", i % 2 === 1 && "lg:order-1")} />
            </article>
          ))}
        </div>
      </section>

      <CtaBooking title="Want a product like these *built for you?*" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Products by Delta Creation Co.",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: absoluteUrl(`/products/${p.slug}`),
          })),
        }}
      />
    </PageTransition>
  );
}
