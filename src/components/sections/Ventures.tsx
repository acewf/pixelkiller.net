import { site } from "@/content/site";
import { ArrowRight, ArrowUpRight } from "../icons";
import { SectionLabel } from "../SectionLabel";
import { FleetBoard } from "../ventures/FleetBoard";

const EASE = "ease-[cubic-bezier(.2,.7,.1,1)]";

export function Ventures() {
  const { ventures } = site;
  const { flagship, open } = ventures;
  return (
    <section id={ventures.id} aria-labelledby="ventures-title" className="border-t border-hairline">
      <div className="shell section-y">
        <SectionLabel meta={ventures} />
        <h2
          id="ventures-title"
          className="mb-[clamp(40px,5vw,64px)] max-w-[17ch] font-display text-section font-[740] text-balance [font-stretch:114%]"
        >
          {ventures.title}
        </h2>

        <article
          aria-labelledby="undrd-title"
          className="reveal grid grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] items-start gap-[clamp(32px,4vw,56px)] border border-line/12 bg-raised p-[clamp(24px,3.4vw,48px)]"
        >
          <div className="flex flex-col gap-[22px]">
            <p className="label-mono text-muted">{flagship.kicker}</p>
            <h3 id="undrd-title" className="font-display text-venture font-extrabold [font-stretch:120%]">
              {flagship.name}
            </h3>
            <p className="text-[clamp(20px,1.8vw,26px)] leading-[1.3] font-[520] [font-stretch:104%]">
              {flagship.tagline}
            </p>
            <p className="max-w-[46ch] text-pretty text-muted">{flagship.body}</p>
            <ul
              aria-label={flagship.capabilitiesLabel}
              className="flex flex-wrap gap-2 font-mono text-[12px] tracking-[0.06em] uppercase"
            >
              {flagship.capabilities.map((capability) => (
                <li key={capability} className="rounded-[2px] border border-line/18 px-3 py-2">
                  {capability}
                </li>
              ))}
            </ul>
            <p className="font-mono text-[12px] leading-[1.75] tracking-[0.04em] text-muted">{flagship.worksWith}</p>
            <a
              href={flagship.link.href}
              data-event={flagship.link.event}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex min-h-11 items-center gap-2.5 self-start text-[20px] font-semibold text-ink [font-stretch:110%]"
            >
              {flagship.link.label}
              <span className="sr-only"> {site.newTab}</span>
              <ArrowUpRight className="block size-4" />
            </a>
          </div>
          <FleetBoard board={flagship.board} />
        </article>

        {/* The open slot spans the row as a call to action: copy left, button bottom right. */}
        <article
          aria-labelledby="open-title"
          className="reveal mt-4 flex flex-wrap items-end justify-between gap-x-12 gap-y-7 bg-accent p-[clamp(24px,3.4vw,48px)] text-on-accent"
        >
          <div className="flex flex-[1_1_420px] flex-col gap-3.5">
            <p className="label-mono">{open.kicker}</p>
            <h3 id="open-title" className="font-display text-card font-[780] [font-stretch:116%]">
              {open.title}
            </h3>
            <p className="max-w-[46ch] text-[17px] leading-[1.5] font-medium">{open.body}</p>
          </div>
          <a
            href={open.cta.href}
            data-event={open.cta.event}
            className={`group inline-flex min-h-[52px] flex-none items-center gap-3.5 rounded-[2px] bg-ground px-[22px] text-base font-semibold text-ink transition-transform duration-300 ${EASE} hover:-translate-y-0.5 focus-visible:outline-on-accent`}
          >
            {open.cta.label}
            <ArrowRight
              className={`block size-[18px] transition-transform duration-300 ${EASE} group-hover:translate-x-1`}
            />
          </a>
        </article>
      </div>
    </section>
  );
}
