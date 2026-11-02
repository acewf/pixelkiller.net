import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Ai } from "@/components/sections/Ai";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Story } from "@/components/sections/Story";
import { Thesis } from "@/components/sections/Thesis";
import { Ventures } from "@/components/sections/Ventures";
import { baseOpenGraph } from "@/content/seo";
import { site } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/" },
};

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-[2px] bg-accent px-4 py-3 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-20"
      >
        {site.skipLink}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Thesis />
        <Ventures />
        <Method />
        <Ai />
        <Story />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
