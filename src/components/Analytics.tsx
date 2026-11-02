"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    umami?: { track: (event: string) => void };
  }
}

// Self-hosted Umami: cookieless, so no consent banner is needed.
const UMAMI_SCRIPT = "https://umami.undrd.app/script.js";
const UMAMI_WEBSITE_ID = "5448c49c-102e-4278-aeea-31e740825672";

/**
 * Page views, plus a click event for any element carrying data-event="name".
 * Clicks are reported fire-and-forget: Umami's own data-umami-event holds a
 * same-tab link until its request finishes, which would delay in-page jumps
 * and mailto links on a slow or unreachable tracker. Only `domain` is tracked,
 * so localhost and Vercel preview deployments stay out of the stats.
 */
export function Analytics({ domain }: { domain: string }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const name = (event.target as Element | null)?.closest<HTMLElement>("[data-event]")?.dataset.event;
      if (name) window.umami?.track(name);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <Script src={UMAMI_SCRIPT} data-website-id={UMAMI_WEBSITE_ID} data-domains={domain} strategy="afterInteractive" />;
}
