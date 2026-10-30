import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { ProductPreview } from "@/components/products/product-preview";
import { ButtonLink } from "@/components/ui/button";
import {
  productDeliveryLabel,
  productPrimaryAction,
  productStatusLabels,
  type Product,
  type ProductStatus,
} from "@/content/products";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProductStatus, string> = {
  available: "border-mint/30 bg-mint/[0.08] text-mint",
  beta: "border-sky/30 bg-sky/[0.08] text-sky",
  "in-development": "border-white/15 bg-white/[0.04] text-fog-300",
};

export function StatusBadge({ status, className }: { status: ProductStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-2 rounded-full border px-3 font-mono text-[0.66rem] tracking-[0.12em] uppercase",
        statusStyles[status],
        className,
      )}
    >
      {status === "available" ? (
        <span className="live-dot !size-1.5" aria-hidden="true" />
      ) : (
        <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      )}
      {productStatusLabels[status]}
    </span>
  );
}

/** Primary action (download / open / early access) plus an optional details link. */
export function ProductActions({
  product,
  details = true,
  size = "md",
}: {
  product: Product;
  details?: boolean;
  size?: "sm" | "md";
}) {
  const action = productPrimaryAction(product, site.email);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink
        href={action.href}
        size={size}
        icon
        {...(action.external && action.href.startsWith("http") && { target: "_blank", rel: "noopener" })}
      >
        {action.label}
      </ButtonLink>
      {details && (
        <ButtonLink href={`/products/${product.slug}`} variant="ghost" size={size}>
          {`About ${product.name}`}
        </ButtonLink>
      )}
    </div>
  );
}

/** Coloured backdrop the preview window sits on. */
export function ProductStage({
  product,
  className,
  previewClassName,
}: {
  product: Product;
  className?: string;
  previewClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-ink-900",
        className,
      )}
      style={{ "--product": product.color } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_70%_at_50%_100%,color-mix(in_oklab,var(--product)_26%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:linear-gradient(to_top,black,transparent)] opacity-40"
      />
      <ProductPreview product={product} className={previewClassName} />
    </div>
  );
}

/** Compact card used in grids: preview on top, details below, whole card links to the product page. */
export function ProductCard({ product, index, className }: { product: Product; index: number; className?: string }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-900 transition-colors duration-500 hover:border-white/20",
        className,
      )}
      style={{ "--product": product.color, "--reveal-delay": `${(index % 2) * 100}ms` } as CSSProperties}
      data-reveal
      data-cursor="View"
    >
      <ProductStage
        product={product}
        className="rounded-none border-0 border-b px-6 pt-8 sm:px-10 sm:pt-10"
        previewClassName="rounded-b-none border-b-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5"
      />
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">{product.category}</p>
          <StatusBadge status={product.status} />
        </div>
        <h3 className="mt-5 flex items-baseline gap-3 text-h3 font-medium">
          {product.name}
          {product.workingName && <span className="text-xs font-normal text-fog-500">working name</span>}
        </h3>
        <p className="mt-3 max-w-[48ch] text-fog-400">{product.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-8 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-fog-300">
            {product.delivery.kind === "download" && <Download className="size-4 shrink-0" aria-hidden="true" />}
            <span className="truncate">{productDeliveryLabel(product)}</span>
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-[var(--product)] group-hover:bg-[var(--product)] group-hover:text-ink-950">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
