import { site } from "@/content/site";
import { SectionLabel } from "../SectionLabel";

export function Story() {
  const { story } = site;
  return (
    <section id={story.id} aria-labelledby="story-title" className="border-t border-hairline">
      <div className="shell section-y">
        <SectionLabel meta={story} />
        <h2
          id="story-title"
          className="mb-[clamp(48px,6vw,88px)] max-w-[16ch] font-display text-section font-[740] text-balance [font-stretch:114%]"
        >
          {story.title}
        </h2>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(136px,100%),1fr))] gap-x-3 gap-y-9 max-[720px]:grid-cols-1">
          {story.entries.map((entry) => (
            <li
              key={entry.year}
              className={`reveal relative border-t pt-[22px] ${entry.current ? "border-accent" : "border-line/16"}`}
            >
              <span
                aria-hidden="true"
                className={`absolute -top-1 left-0 size-[7px] ${entry.current ? "bg-accent" : "bg-ink"}`}
              />
              <span
                className={`block font-display text-year font-bold [font-stretch:114%] ${entry.current ? "text-accent" : ""}`}
              >
                {entry.year}
              </span>
              <span className={`mt-3.5 block text-[15px] leading-[1.45] ${entry.current ? "text-ink" : "text-ink-soft"}`}>
                {entry.role}
              </span>
              <span className="mt-2 block font-mono text-[12px] tracking-[0.06em] text-muted uppercase">{entry.org}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
