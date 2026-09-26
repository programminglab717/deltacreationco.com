import { ViewTransition, type ReactNode } from "react";

/** Animates page content in and out on client-side navigations. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
