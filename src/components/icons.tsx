interface IconProps {
  className?: string;
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <path d="M2 9h13M10 4l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function ArrowLong({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className={className}>
      <path d="M4 14h19M16 7l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

type Cell = "top" | "left" | "right" | "killed" | "signal";

const CELL_CLASS: Record<Cell, string> = {
  top: "fill-ink",
  left: "fill-muted",
  right: "fill-ink/40",
  killed: "fill-none stroke-ink/40 [stroke-width:0.07]",
  signal: "fill-accent",
};

/** Isometric 3×3×3 faces of the voxel cube, inset so the grid reads. */
const CELLS: [string, Cell][] = [
  ["0.000,-2.900 0.693,-2.500 0.000,-2.100 -0.693,-2.500", "top"],
  ["-0.866,-2.400 -0.173,-2.000 -0.866,-1.600 -1.559,-2.000", "signal"],
  ["-1.732,-1.900 -1.039,-1.500 -1.732,-1.100 -2.425,-1.500", "top"],
  ["0.866,-2.400 1.559,-2.000 0.866,-1.600 0.173,-2.000", "top"],
  ["0.000,-1.900 0.693,-1.500 0.000,-1.100 -0.693,-1.500", "top"],
  ["-0.866,-1.400 -0.173,-1.000 -0.866,-0.600 -1.559,-1.000", "top"],
  ["1.732,-1.900 2.425,-1.500 1.732,-1.100 1.039,-1.500", "top"],
  ["0.866,-1.400 1.559,-1.000 0.866,-0.600 0.173,-1.000", "top"],
  ["0.000,-0.900 0.693,-0.500 0.000,-0.100 -0.693,-0.500", "killed"],
  ["2.511,1.450 2.511,0.650 1.819,1.050 1.819,1.850", "right"],
  ["1.645,1.950 1.645,1.150 0.953,1.550 0.953,2.350", "killed"],
  ["0.779,2.450 0.779,1.650 0.087,2.050 0.087,2.850", "right"],
  ["2.511,0.450 2.511,-0.350 1.819,0.050 1.819,0.850", "right"],
  ["1.645,0.950 1.645,0.150 0.953,0.550 0.953,1.350", "right"],
  ["0.779,1.450 0.779,0.650 0.087,1.050 0.087,1.850", "right"],
  ["2.511,-0.550 2.511,-1.350 1.819,-0.950 1.819,-0.150", "right"],
  ["1.645,-0.050 1.645,-0.850 0.953,-0.450 0.953,0.350", "right"],
  ["0.779,0.450 0.779,-0.350 0.087,0.050 0.087,0.850", "killed"],
  ["-2.511,1.450 -1.819,1.850 -1.819,1.050 -2.511,0.650", "left"],
  ["-2.511,0.450 -1.819,0.850 -1.819,0.050 -2.511,-0.350", "left"],
  ["-2.511,-0.550 -1.819,-0.150 -1.819,-0.950 -2.511,-1.350", "left"],
  ["-1.645,1.950 -0.953,2.350 -0.953,1.550 -1.645,1.150", "left"],
  ["-1.645,0.950 -0.953,1.350 -0.953,0.550 -1.645,0.150", "left"],
  ["-1.645,-0.050 -0.953,0.350 -0.953,-0.450 -1.645,-0.850", "left"],
  ["-0.779,2.450 -0.087,2.850 -0.087,2.050 -0.779,1.650", "left"],
  ["-0.779,1.450 -0.087,1.850 -0.087,1.050 -0.779,0.650", "left"],
  ["-0.779,0.450 -0.087,0.850 -0.087,0.050 -0.779,-0.350", "killed"],
];

const VIEWBOX = "-2.7 -3.1 5.4 6.2";

/** The Pixelkiller mark: a cube of pixels with a few killed. */
export function VoxelMark({ className }: IconProps) {
  return (
    <svg viewBox={VIEWBOX} aria-hidden="true" className={className}>
      {CELLS.map(([points, cell]) => (
        <polygon key={points} points={points} className={CELL_CLASS[cell]} />
      ))}
    </svg>
  );
}

/** `a` over `b` at `weight`, for #rrggbb colours. */
function mixHex(a: string, b: string, weight: number) {
  const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2]
    .map((i) => Math.round(channel(a, i) * weight + channel(b, i) * (1 - weight)).toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * The mark as a standalone SVG document with literal colours, for raster
 * outputs that cannot read CSS (the social card and apple icon).
 */
export function voxelMarkSvg(swatch: { ground: string; ink: string; muted: string; accent: string }): string {
  const shade = mixHex(swatch.ink, swatch.ground, 0.4);
  const paint: Record<Cell, string> = {
    top: `fill="${swatch.ink}"`,
    left: `fill="${swatch.muted}"`,
    right: `fill="${shade}"`,
    killed: `fill="none" stroke="${shade}" stroke-width="0.07"`,
    signal: `fill="${swatch.accent}"`,
  };
  const polygons = CELLS.map(([points, cell]) => `<polygon points="${points}" ${paint[cell]}/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}">${polygons}</svg>`;
}
