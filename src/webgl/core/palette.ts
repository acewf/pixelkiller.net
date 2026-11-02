import type { Rgb, ScenePalette } from "./types";

let probe: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

function probeContext() {
  if (probe) return probe;
  if (typeof OffscreenCanvas !== "undefined") {
    probe = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: true });
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    probe = canvas.getContext("2d", { willReadFrequently: true });
  }
  return probe;
}

/**
 * Normalises any CSS colour the browser understands (hex, rgb(), hsl(), oklch(),
 * color-mix()…) to 0..1 channels. The 2D context serialises sRGB colours as
 * #rrggbb or rgba(); only other syntaxes are painted and read back.
 */
export function parseColor(value: string): Rgb | null {
  const ctx = probeContext();
  const colour = value.trim();
  if (!ctx || !colour) return null;
  // An invalid colour leaves fillStyle untouched, so two different sentinels disagree.
  ctx.fillStyle = "#000";
  ctx.fillStyle = colour;
  const normalised = String(ctx.fillStyle);
  ctx.fillStyle = "#fff";
  ctx.fillStyle = colour;
  if (String(ctx.fillStyle) !== normalised) return null;

  const hex = /^#([0-9a-f]{6})$/i.exec(normalised);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const rgb = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(normalised);
  if (rgb) return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255];

  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/** Reads the scene colours from the theme custom properties in effect on `element`. */
export function readScenePalette(element: Element): ScenePalette {
  const style = getComputedStyle(element);
  const read = (name: string, fallback: Rgb) => {
    const raw = style.getPropertyValue(name);
    const rgb = parseColor(raw);
    if (!rgb) console.warn(`[webgl] ${name} (“${raw.trim()}”) is not a colour; using the default`);
    return rgb ?? fallback;
  };
  return {
    ground: read("--pk-ground", [0.027, 0.031, 0.039]),
    ink: read("--pk-ink", [0.925, 0.929, 0.933]),
    muted: read("--pk-muted", [0.604, 0.627, 0.651]),
    accent: read("--pk-accent", [1, 0.357, 0.216]),
  };
}
