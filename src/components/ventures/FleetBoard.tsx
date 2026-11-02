import type { SiteContent, Tone } from "@/content/site";
import { PartsCounter } from "./PartsCounter";

type Board = SiteContent["ventures"]["flagship"]["board"];

const TONE_TEXT: Record<Tone, string> = {
  good: "text-status-good",
  warn: "text-status-warn",
  info: "text-status-info",
};

const TONE_FILL: Record<Tone, string> = {
  good: "bg-status-good",
  warn: "bg-status-warn",
  info: "bg-status-info",
};

/** Yield bars span 95–100%, the band that matters on a production line. */
const barWidth = (yieldPct: number) => `${Math.round(Math.min(1, Math.max(0, (yieldPct - 95) / 5)) * 100)}%`;

/** Illustrative Undrd Control fleet overview, built from the product's own demo figures. */
export function FleetBoard({ board }: { board: Board }) {
  const kpis = [
    { label: board.yieldLabel, value: board.yieldValue, tone: "text-status-good" },
    { label: board.partsLabel, value: <PartsCounter start={board.partsStart} />, tone: "text-ink" },
    { label: board.onlineLabel, value: board.onlineValue, tone: "text-ink" },
    { label: board.alertsLabel, value: board.alertsValue, tone: "text-status-warn" },
  ];

  return (
    <figure className="flex flex-col gap-4 border border-line/12 bg-ground p-[18px] font-mono text-[12px]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 tracking-[0.08em] text-muted uppercase">
        <span className="text-ink">{board.title}</span>
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-[7px] text-status-good">
            <span aria-hidden="true" className="live-dot inline-block size-1.5 rounded-full bg-status-good" />
            {board.live}
          </span>
          <span className="border border-line/24 px-[7px] py-[3px]">{board.tag}</span>
        </span>
      </figcaption>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(118px,100%),1fr))] gap-2">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex flex-col gap-2.5 border border-line/10 px-3 pt-3 pb-3.5">
            <span className="text-[11px] tracking-[0.08em] text-muted uppercase">{kpi.label}</span>
            <span
              className={`font-sans text-[26px] leading-none font-semibold tabular-nums [font-stretch:112%] ${kpi.tone}`}
            >
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      <ul aria-label={board.plantsLabel} className="flex flex-col gap-3.5">
        {board.plants.map((plant) => (
          <li key={plant.name} className="flex flex-col gap-[7px]">
            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
              <span className="text-ink">{plant.name}</span>
              <span className="text-muted">
                {plant.machines} · <span className={TONE_TEXT[plant.tone]}>{plant.status}</span>
              </span>
              <span className="text-ink tabular-nums">{plant.yieldPct.toFixed(1)}%</span>
            </div>
            <span aria-hidden="true" className="block h-[3px] bg-line/10">
              <span className={`block h-[3px] ${TONE_FILL[plant.tone]}`} style={{ width: barWidth(plant.yieldPct) }} />
            </span>
          </li>
        ))}
      </ul>

      <ol aria-label={board.eventsLabel} className="flex flex-col gap-[9px] border-t border-line/10 pt-3.5 text-ink-quiet">
        {board.events.map((event) => (
          <li key={event.text} className="flex items-baseline gap-2.5">
            <span aria-hidden="true" className={`size-1.5 flex-none ${TONE_FILL[event.tone]}`} />
            {event.text}
          </li>
        ))}
      </ol>
    </figure>
  );
}
