import { site } from "@/content/site";
import { ArrowLong } from "../icons";
import { pad, SectionLabel } from "../SectionLabel";

export function Method() {
  const { method } = site;
  return (
    <section id={method.id} aria-labelledby="method-title" className="border-t border-hairline">
      <div className="shell section-y">
        <SectionLabel meta={method} />
        <h2
          id="method-title"
          className="mb-[clamp(32px,4vw,56px)] max-w-[16ch] font-display text-section font-[740] text-balance [font-stretch:114%]"
        >
          {method.title}
        </h2>
        <ol className="border-b border-hairline">
          {method.steps.map((step, i) => (
            <li
              key={step.title}
              className="group reveal flex flex-wrap items-baseline gap-x-10 gap-y-2.5 border-t border-hairline py-[30px]"
            >
              <span className="flex-[0_0_72px] font-mono text-[13px] tracking-[0.08em] text-muted transition-colors duration-300 group-hover:text-accent">
                {pad(i + 1)}
              </span>
              <h3 className="flex-[1_1_300px] font-display text-row font-bold [font-stretch:112%]">{step.title}</h3>
              <p className="flex-[1.3_1_340px] text-[17px] leading-[1.55] text-muted">{step.body}</p>
              <ArrowLong className="size-7 flex-none self-center opacity-30 transition-[opacity,transform,color] duration-[400ms] ease-[cubic-bezier(.2,.7,.1,1)] group-hover:translate-x-2 group-hover:text-accent group-hover:opacity-100" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
