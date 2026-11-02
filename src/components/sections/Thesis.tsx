import { Fragment } from "react";
import { site } from "@/content/site";
import { pad, SectionLabel } from "../SectionLabel";

export function Thesis() {
  const { thesis } = site;
  const plain = thesis.statement.split(" ");
  const emphasis = thesis.emphasis.split(" ");
  return (
    <section id={thesis.id} aria-labelledby="thesis-title" className="border-t border-hairline">
      <div className="shell section-y">
        <SectionLabel meta={thesis} className="mb-[clamp(40px,5vw,72px)]" />
        <h2
          id="thesis-title"
          className="max-w-[15ch] font-display text-statement font-[760] text-balance [font-stretch:116%]"
        >
          {plain.map((word, i) => (
            <Fragment key={`plain-${i}`}>
              <span className="word-reveal">{word}</span>{" "}
            </Fragment>
          ))}
          {emphasis.map((word, i) => (
            <Fragment key={`emphasis-${i}`}>
              {i > 0 && " "}
              <span className="word-reveal text-accent">{word}</span>
            </Fragment>
          ))}
        </h2>
        <ol className="mt-[clamp(56px,7vw,104px)] grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-10 gap-y-8">
          {thesis.points.map((point, i) => (
            <li key={point} className="reveal border-t border-line/14 pt-[22px]">
              <span className="mb-3.5 block font-mono text-[12px] tracking-[0.08em] text-accent">{pad(i + 1)}</span>
              <p className="text-[19px] leading-[1.5] text-pretty text-ink-soft">{point}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
