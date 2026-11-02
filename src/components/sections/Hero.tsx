import { site } from "@/content/site";
import { PARTICLE_COUNT } from "@/webgl/renderers/particles";
import { ArrowRight } from "../icons";
import { HeroScene } from "../scene/HeroScene";
import { pad } from "../SectionLabel";

const EASE = "ease-[cubic-bezier(.2,.7,.1,1)]";

export function Hero() {
  const { hero } = site;
  return (
    <HeroScene labelledBy="hero-title">
      <div className="shell relative z-[2] flex flex-1 flex-col justify-end pt-[168px] pb-[52px]">
        <p className="fade-in label-mono mb-[22px] text-muted">{hero.eyebrow}</p>
        <h1
          id="hero-title"
          data-hero-safe
          className="w-fit max-w-full font-display text-hero font-[780] [font-stretch:118%]"
        >
          {hero.titleLines.map((line) => (
            <span key={line} className="line-mask">
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <div className="mt-9 flex flex-wrap items-end justify-between gap-x-14 gap-y-9">
          <div className="fade-in max-w-[580px] flex-[1_1_420px]">
            <p className="text-[clamp(17px,1.35vw,19px)] leading-[1.55] text-pretty text-ink-quiet">{hero.lead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={hero.primary.href}
                className={`group inline-flex min-h-[52px] items-center gap-3.5 rounded-[2px] bg-accent px-[22px] text-base font-[650] text-on-accent transition-transform duration-300 ${EASE} hover:-translate-y-0.5`}
              >
                {hero.primary.label}
                <ArrowRight
                  className={`block size-[18px] transition-transform duration-300 ${EASE} group-hover:translate-x-1`}
                />
              </a>
              <a
                href={hero.secondary.href}
                className={`inline-flex min-h-[52px] items-center rounded-[2px] border border-line/30 px-[22px] text-base font-[550] text-ink transition-[translate,border-color] duration-300 ${EASE} hover:-translate-y-0.5 hover:border-ink`}
              >
                {hero.secondary.label}
              </a>
            </div>
          </div>

          <div data-phase-readout className="label-mono flex-[0_1_400px] text-muted">
            <p className="mb-3.5">
              {hero.readout.caption} · {Math.round(PARTICLE_COUNT / 1000)}k points
            </p>
            <ol aria-label={hero.readout.label} className="mb-3.5 flex flex-wrap gap-x-5 gap-y-1.5">
              {hero.readout.phases.map((phase, i) => (
                <li key={phase} data-phase-item={i}>
                  {pad(i + 1)} {phase}
                </li>
              ))}
            </ol>
            <div aria-hidden="true" className="h-px bg-line/16">
              <div className="phase-progress h-px bg-accent" />
            </div>
          </div>
        </div>
      </div>
    </HeroScene>
  );
}
