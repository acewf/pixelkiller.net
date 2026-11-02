/**
 * Theme registry.
 *
 * A theme is two things:
 * - a block of `--pk-*` custom properties in src/app/globals.css under
 *   `[data-theme="<id>"]` (every Tailwind colour utility resolves to those), and
 * - an entry here naming the WebGL renderer that draws the hero scene.
 *
 * The root layout sets `<html data-theme>`; WebGL renderers read their colours
 * from the same custom properties when they mount, so they follow the theme.
 */

/** Renderers registered in src/webgl/renderers/index.ts. */
export type HeroRendererId = "particles";

export interface ThemeDefinition {
  label: string;
  /** Renderer that draws the hero scene. */
  renderer: HeroRendererId;
  colorScheme: "dark" | "light";
  /**
   * The theme's core colours for outputs that cannot read CSS: the browser's
   * theme-color, the social card and the apple icon. Mirror the --pk-* values.
   */
  swatch: { ground: string; ink: string; muted: string; accent: string };
}

export const themes = {
  signal: {
    label: "Signal",
    renderer: "particles",
    colorScheme: "dark",
    swatch: { ground: "#07080a", ink: "#ecedee", muted: "#9aa0a6", accent: "#ff5b37" },
  },
} as const satisfies Record<string, ThemeDefinition>;

export type ThemeId = keyof typeof themes;

export const defaultTheme: ThemeId = "signal";

export function resolveTheme(id: string | null | undefined): ThemeDefinition {
  return id && Object.hasOwn(themes, id) ? themes[id as ThemeId] : themes[defaultTheme];
}
