import type { SectionMeta } from "@/content/site";

/** "02 / Thesis ··· Why a developer" row that opens every section. */
export function SectionLabel({
  meta,
  className = "mb-[clamp(40px,5vw,64px)]",
}: {
  meta: SectionMeta;
  className?: string;
}) {
  return (
    <div className={`label-mono flex flex-wrap justify-between gap-x-6 gap-y-2 text-muted ${className}`}>
      <span>
        <span className="text-accent">{meta.index}</span> / {meta.label}
      </span>
      <span>{meta.aside}</span>
    </div>
  );
}

export const pad = (n: number) => String(n).padStart(2, "0");
