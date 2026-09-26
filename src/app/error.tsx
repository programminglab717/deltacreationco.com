"use client";

import { useEffect } from "react";
import { site } from "@/content/site";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[80svh] items-center pt-[calc(var(--header-h)+3rem)] pb-24">
      <div className="container-x">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-6 max-w-[14ch] text-h1 font-medium">
          That wasn&apos;t supposed to <span className="font-accent text-accent">happen.</span>
        </h1>
        <p className="mt-8 max-w-md text-lead text-fog-300">
          Please try again. If the problem continues, email us at{" "}
          <a href={`mailto:${site.email}`} className="text-fog-100 underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
        <button type="button" onClick={reset} className="btn btn-primary mt-10">
          <span className="roll">
            <span data-text="Try again">Try again</span>
          </span>
        </button>
      </div>
    </section>
  );
}
