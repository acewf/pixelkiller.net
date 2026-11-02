import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { baseOpenGraph } from "@/content/seo";
import { site } from "@/content/site";
import { defaultTheme, themes } from "@/theme/themes";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// No generated metric fallback: glyphs outside the latin subset (→, ▍) should
// fall through to the system monospace, not to an adjusted Arial.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.hero.lead,
  openGraph: baseOpenGraph,
};

export const viewport: Viewport = {
  themeColor: themes[defaultTheme].swatch.ground,
  colorScheme: themes[defaultTheme].colorScheme,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-GB" data-theme={defaultTheme} className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-ground font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
