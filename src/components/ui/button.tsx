import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "outline-dark";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: boolean;
  magnetic?: boolean;
  className?: string;
  children: string;
};

function classes(variant: Variant, size: Size, className?: string) {
  return cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", size === "lg" && "btn-lg", className);
}

function Label({ children, icon }: { children: string; icon?: boolean }) {
  return (
    <>
      <span className="roll">
        <span data-text={children}>{children}</span>
      </span>
      {icon && (
        <span className="btn-icon">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      )}
    </>
  );
}

function withMagnet(node: ReactNode, magnetic?: boolean) {
  return magnetic ? <Magnetic>{node}</Magnetic> : node;
}

/** Link styled as a button, with the rolling-label hover effect. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  magnetic,
  className,
  children,
  ...rest
}: Common & Omit<ComponentProps<typeof Link>, "children" | "className">) {
  return withMagnet(
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      <Label icon={icon}>{children}</Label>
    </Link>,
    magnetic,
  );
}
