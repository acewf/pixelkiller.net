import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ArrowRight, VoxelMark } from "@/components/icons";
import { Nav } from "@/components/Nav";
import { site } from "@/content/site";

export const metadata: Metadata = { title: site.notFound.title };

const EASE = "ease-[cubic-bezier(.2,.7,.1,1)]";

export default function NotFound() {
  const { notFound } = site;
  return (
    <>
      <Nav />
      <main id="main">
        <section
          aria-labelledby="not-found-title"
          className="shell relative flex min-h-[max(640px,88svh)] flex-col justify-end pt-[168px] pb-[clamp(72px,9vw,128px)]"
        >
          <VoxelMark className="pointer-events-none absolute top-[clamp(140px,16vw,200px)] right-[clamp(16px,6vw,96px)] hidden h-[clamp(180px,24vw,340px)] w-auto min-[900px]:block" />
          <p className="label-mono mb-[22px] text-muted">
            <span className="text-accent">{notFound.code}</span> · {notFound.label}
          </p>
          <h1
            id="not-found-title"
            className="max-w-[14ch] font-display text-statement font-[780] text-balance [font-stretch:118%]"
          >
            {notFound.heading}
          </h1>
          <p className="mt-9 max-w-[46ch] text-[clamp(17px,1.35vw,19px)] leading-[1.55] text-pretty text-ink-quiet">
            {notFound.body}
          </p>
          <a
            href={notFound.cta.href}
            className={`group mt-7 inline-flex min-h-[52px] items-center gap-3.5 self-start rounded-[2px] bg-accent px-[22px] text-base font-[650] text-on-accent transition-transform duration-300 ${EASE} hover:-translate-y-0.5`}
          >
            {notFound.cta.label}
            <ArrowRight
              className={`block size-[18px] transition-transform duration-300 ${EASE} group-hover:translate-x-1`}
            />
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
