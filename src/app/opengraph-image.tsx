/* eslint-disable no-restricted-syntax -- next/og (Satori) reads inline styles only; className is ignored. */
import { ImageResponse } from "next/og";
import { voxelMarkSvg } from "@/components/icons";
import { site } from "@/content/site";
import { defaultTheme, themes } from "@/theme/themes";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Per request: a slow font server must not stall the build. */
const FONT_TIMEOUT_MS = 4000;

/**
 * Archivo 800 at 125% width as TTF (Satori cannot read woff2), subset to `text`.
 * Null when Google Fonts is unreachable or slow: the card then falls back to
 * next/og's bundled font rather than failing the build.
 */
async function loadArchivo(text: string): Promise<ArrayBuffer | null> {
  try {
    const query = `family=Archivo:wdth,wght@125,800&text=${encodeURIComponent(text)}`;
    const cssResponse = await fetch(`https://fonts.googleapis.com/css2?${query}`, {
      signal: AbortSignal.timeout(FONT_TIMEOUT_MS),
    });
    const css = await cssResponse.text();
    const src = /src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/.exec(css)?.[1];
    if (!src) return null;
    const font = await fetch(src, { signal: AbortSignal.timeout(FONT_TIMEOUT_MS) });
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const swatch = themes[defaultTheme].swatch;
  const [first, second] = site.hero.titleLines;
  const wordmark = site.name.toUpperCase();
  const host = new URL(site.url).host;
  const font = await loadArchivo(`${wordmark}${first}${second}${site.legal}${host}`);
  const mark = `data:image/svg+xml;base64,${Buffer.from(voxelMarkSvg(swatch)).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: swatch.ground,
          color: swatch.ink,
          fontFamily: font ? "Archivo" : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={mark} width={52} height={60} alt="" />
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 3 }}>{wordmark}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 116, fontWeight: 800, lineHeight: 0.96, letterSpacing: -4 }}>
          <div>{first}</div>
          <div>{second}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: swatch.muted }}>
          <div>{site.legal}</div>
          <div style={{ color: swatch.accent }}>{host}</div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Archivo", data: font, weight: 800, style: "normal" }] : undefined },
  );
}
