import type { Metadata } from "next";
import { site } from "./site";

/**
 * Open Graph fields every page shares. A page's `openGraph` replaces the
 * layout's entirely, so pages spread this and add their own `url`.
 */
export const baseOpenGraph = {
  type: "website",
  locale: "en_GB",
  siteName: site.name,
  title: site.title,
  description: site.hero.lead,
} satisfies NonNullable<Metadata["openGraph"]>;
