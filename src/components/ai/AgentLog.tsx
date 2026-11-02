import type { SiteContent } from "@/content/site";

type Log = SiteContent["ai"]["log"];

/** How a venture gets built: agents do the work, a human makes the call. */
export function AgentLog({ log }: { log: Log }) {
  return (
    <figure className="reveal mt-4 border border-line/12 bg-inset font-mono text-[13px]">
      <figcaption className="label-mono flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-[18px] py-3 text-muted">
        <span>{log.title}</span>
        <span className="border border-line/24 px-[7px] py-[3px]">{log.tag}</span>
      </figcaption>
      <ol className="flex flex-col gap-3 px-[18px] pt-[18px] pb-[22px] leading-[1.5]">
        {log.steps.map((step) => (
          <li key={step.role} className="flex flex-wrap gap-x-[18px] gap-y-0.5">
            <span className="flex-[0_0_116px] text-accent">› {step.role}</span>
            <span className="flex-[1_1_300px] text-ink-soft">{step.task}</span>
            <span className="text-faint">{step.status}</span>
          </li>
        ))}
        <li className="flex flex-wrap gap-x-[18px] gap-y-0.5 border-t border-dashed border-line/14 pt-3">
          <span className="flex-[0_0_116px] text-ink">› {log.human.role}</span>
          <span className="flex-[1_1_300px] text-ink">{log.human.task}</span>
          <span className="text-accent">
            {log.human.status}
            <span aria-hidden="true" className="caret">
              {" ▍"}
            </span>
          </span>
        </li>
      </ol>
    </figure>
  );
}
