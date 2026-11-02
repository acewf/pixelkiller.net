import { site } from "@/content/site";
import { AgentLog } from "../ai/AgentLog";
import { LatticeFigure } from "../scene/LatticeFigure";
import { SectionLabel } from "../SectionLabel";

export function Ai() {
  const { ai } = site;
  return (
    <section id={ai.id} aria-labelledby="ai-title" className="border-t border-hairline">
      <div className="shell section-y">
        <SectionLabel meta={ai} />
        <div className="mb-[clamp(36px,4vw,56px)] flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <h2 id="ai-title" className="max-w-[12ch] font-display text-ai font-[760] text-balance [font-stretch:114%]">
            {ai.title}
          </h2>
          <p className="max-w-[46ch] text-pretty text-muted">{ai.lead}</p>
        </div>

        <LatticeFigure>
          <figcaption className="label-mono absolute inset-x-4 bottom-3 flex flex-wrap justify-between gap-2 text-muted">
            <span>{ai.lattice.rules}</span>
            <span className="text-accent">{ai.lattice.learning}</span>
          </figcaption>
        </LatticeFigure>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-4">
          <div className="reveal border border-line/12 p-[clamp(24px,3vw,40px)]">
            <p className="label-mono mb-[22px] text-muted">{ai.before.label}</p>
            <ul className="flex flex-col gap-3.5 text-[18px] leading-[1.4] text-muted">
              {ai.before.items.map((item) => (
                <li key={item} className="flex items-baseline gap-3.5">
                  <span aria-hidden="true" className="h-px w-2.5 flex-none -translate-y-[5px] bg-faint" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal border border-line/18 bg-raised p-[clamp(24px,3vw,40px)]">
            <p className="label-mono mb-[22px] text-accent">{ai.after.label}</p>
            <ul className="flex flex-col gap-3.5 text-[18px] leading-[1.4] text-ink">
              {ai.after.items.map((item) => (
                <li key={item} className="flex items-baseline gap-3.5">
                  <span aria-hidden="true" className="size-2 flex-none -translate-y-0.5 bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <AgentLog log={ai.log} />
      </div>
    </section>
  );
}
