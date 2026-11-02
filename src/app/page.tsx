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
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/" },
};

export default function Home() {
  return (
    <>
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
