import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Download, Globe } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { ProductActions, ProductCard, ProductStage, StatusBadge } from "@/components/products/product-parts";
import { CtaBooking } from "@/components/sections/cta-booking";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getProduct,
  productPrimaryAction,
  productSiteUrl,
  productStatusLabels,
  products,
  type Product,
} from "@/content/products";
import { absoluteUrl, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.seo.title,
    description: product.seo.description,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug).slice(0, 2);
  const siteUrl = productSiteUrl(product);

  return (
    <PageTransition>
      <div style={{ "--product": product.color } as CSSProperties}>
        <PageHero
          crumbs={[
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]}
          eyebrow={`${product.name}${product.workingName ? " (working name)" : ""} · ${product.category}`}
          title={product.headline}
          lead={product.description}
          aside={
            <dl className="surface grid grid-cols-2 overflow-hidden rounded-[2rem] bg-ink-900">
              {[
                { label: "Status", value: productStatusLabels[product.status] },
                { label: "Type", value: product.delivery.kind === "web" ? "Web app" : "Installed app" },
                {
                  label: product.delivery.kind === "web" ? "Address" : "Platforms",
                  value:
                    product.delivery.kind === "web"
                      ? (siteUrl ?? "").replace("https://", "")
                      : product.delivery.platforms.map((p) => p.name).join(", "),
                },
                { label: "Made by", value: site.name },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex min-w-0 flex-col gap-2 p-6 sm:p-7",
                    i % 2 === 0 && "border-r border-white/[0.07]",
                    i < 2 && "border-b border-white/[0.07]",
                  )}
                >
                  <dt className="font-mono text-[0.65rem] tracking-[0.14em] text-fog-500 uppercase">{item.label}</dt>
                  <dd className="text-lg font-medium tracking-tight break-words text-fog-100">{item.value}</dd>
                </div>
              ))}
            </dl>
          }
        >
          <div className="flex flex-col gap-5">
            <StatusBadge status={product.status} className="w-fit" />
            <ProductActions product={product} details={false} />
          </div>
        </PageHero>

        <section className="pb-24 md:pb-32" aria-label={`${product.name} preview`}>
          <div className="container-x" data-reveal="scale">
            <ProductStage product={product} className="p-3 sm:p-10 lg:p-16" previewClassName="mx-auto max-w-5xl" />
            {!product.screenshot && (
              <p className="mt-4 text-center text-xs text-fog-500">
                Illustrated preview of the {product.name} interface.
              </p>
            )}
          </div>
        </section>

        <section
          className="on-paper rounded-t-[2.5rem] bg-paper section-y md:rounded-t-[4rem]"
          aria-labelledby="features-heading"
        >
          <div className="container-x">
            <SectionHeading
              id="features-heading"
              eyebrow={`Inside ${product.name}`}
              title="What it *does for you.*"
              titleClassName="max-w-[14ch]"
            />
            <ul className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-paper-300 bg-paper-300 sm:grid-cols-2 lg:grid-cols-3">
              {product.features.map((f, i) => (
                <li
                  key={f.title}
                  className="flex flex-col gap-4 bg-paper p-7 sm:p-9"
                  data-reveal
                  style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as CSSProperties}
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-paper-ink text-[var(--product)]">
                    <Icon name={f.icon} className="size-5" />
                  </span>
                  <h3 className="mt-2 text-xl font-medium tracking-tight">{f.title}</h3>
                  <p className="text-paper-muted">{f.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <GetIt product={product} />

        <section className="pb-24 md:pb-32" aria-labelledby="more-products-heading">
          <div className="container-x">
            <h2 id="more-products-heading" className="eyebrow">
              More from the studio
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {others.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <CtaBooking title="Need software like this *built for you?*" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": product.delivery.kind === "web" ? "WebApplication" : "SoftwareApplication",
          name: product.name,
          description: product.seo.description,
          applicationCategory: product.category,
          operatingSystem:
            product.delivery.kind === "web"
              ? "Any (web browser)"
              : product.delivery.platforms.map((p) => p.name).join(", "),
          url: siteUrl ?? absoluteUrl(`/products/${product.slug}`),
          publisher: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />
    </PageTransition>
  );
}

/** How to get the product: per-platform downloads, the web address, or early access. */
function GetIt({ product }: { product: Product }) {
  const { delivery } = product;
  const action = productPrimaryAction(product, site.email);
  const siteUrl = productSiteUrl(product);
  const inDevelopment = product.status === "in-development";

  return (
    <section className="section-y" aria-labelledby="get-heading">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <SectionHeading
          id="get-heading"
          eyebrow={inDevelopment ? "Coming soon" : "Get started"}
          title={
            inDevelopment
              ? `Be first to try *${product.name}.*`
              : delivery.kind === "web"
                ? "Open it in *your browser.*"
                : `Download *${product.name}.*`
          }
          lead={
            inDevelopment
              ? `${product.name} is in development. Ask for early access and we'll let you know as soon as it's ready to try.`
              : delivery.kind === "web"
                ? "Nothing to install. It runs on its own subdomain and works on any modern browser."
                : "Pick your platform below to download the installer."
          }
          titleClassName="max-w-[14ch]"
        />

        <div className="flex flex-col gap-3" data-reveal>
          {delivery.kind === "download" && !inDevelopment ? (
            delivery.platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                className="group flex items-center justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-ink-900 p-6 transition-colors duration-500 hover:border-[var(--product)] sm:p-8"
                data-cursor="Download"
              >
                <span className="flex items-center gap-5">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/[0.05] text-[var(--product)]">
                    <Download className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xl font-medium tracking-tight">{`${product.name} for ${platform.name}`}</span>
                    {platform.note && <span className="mt-1 block text-sm text-fog-400">{platform.note}</span>}
                  </span>
                </span>
                <ArrowUpRight
                  className="size-5 text-fog-400 transition-transform duration-500 group-hover:rotate-45 group-hover:text-fog-100"
                  aria-hidden="true"
                />
              </a>
            ))
          ) : (
            <a
              href={action.href}
              {...(action.href.startsWith("http") && { target: "_blank", rel: "noopener" })}
              className="group flex items-center justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-ink-900 p-6 transition-colors duration-500 hover:border-[var(--product)] sm:p-8"
            >
              <span className="flex min-w-0 items-center gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-[var(--product)]">
                  {inDevelopment ? (
                    <Icon name="bell" className="size-5" />
                  ) : (
                    <Globe className="size-5" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-xl font-medium tracking-tight">{action.label}</span>
                  <span className="mt-1 block truncate font-mono text-sm text-fog-400">
                    {inDevelopment ? site.email : siteUrl?.replace("https://", "")}
                  </span>
                </span>
              </span>
              <ArrowUpRight
                className="size-5 shrink-0 text-fog-400 transition-transform duration-500 group-hover:rotate-45 group-hover:text-fog-100"
                aria-hidden="true"
              />
            </a>
          )}
          {delivery.kind === "download" && siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener"
              className="link-underline mt-2 w-fit text-sm text-fog-400 hover:text-fog-100"
            >
              Release notes &amp; help at {siteUrl.replace("https://", "")}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
