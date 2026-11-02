# pixelkiller.net

Website for Pixelkiller Ltd, the venture studio of Pedro Martins: one page that
tells the story from pixels to production, presents the ventures (Undrd Control
first), and shows the craft through two real-time WebGL2 scenes.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS 4, configured in CSS (`src/app/globals.css`), no `tailwind.config`
- Raw WebGL2: no 3D library; shaders and renderers live in `src/webgl`
- Fonts via `next/font/google`: Archivo (variable, `wdth` axis) and JetBrains Mono
- ESLint 9 flat config (`eslint.config.mjs`) with `eslint-config-next`

Node 20.9 or newer (`.nvmrc` pins 20.11).

## Scripts

```bash
npm install
npm run dev     # dev server on http://localhost:3000
npm run build   # production build; every route is prerendered
npm start       # serve the production build
npm run lint    # eslint .
npx tsc --noEmit
```

## Structure

```
src/
  app/
    layout.tsx        fonts, metadata, <html lang="en-GB" data-theme>
    page.tsx          the one page: Nav, sections, Footer
    not-found.tsx     404 page (same Nav and Footer)
    globals.css       Tailwind, design tokens, themes, motion
    icon.svg, favicon.ico   favicon (the voxel-cube mark; .ico holds 16/32/48 px)
    apple-icon.tsx, opengraph-image.tsx   raster icon and social card (next/og)
    robots.ts, sitemap.ts
  content/site.ts     all copy, typed as SiteContent
  content/seo.ts      Open Graph fields shared by every page
  theme/themes.ts     theme registry: label + hero renderer per theme
  components/
    Nav.tsx, Footer.tsx, SectionLabel.tsx, icons.tsx
    Analytics.tsx     Umami tracker and data-event click reporting (client)
    sections/         Hero, Thesis, Ventures, Method, Ai, Story, Contact (server components)
    ventures/         FleetBoard, PartsCounter (client: the illustrative counter)
    ai/AgentLog.tsx
    scene/            HeroScene, LatticeFigure (client), mountScene
  webgl/
    core/             stage (one fixed context attribute set, DPR ≤ 1.5 resize, a rAF
                      loop that only runs while visible and animating, context-loss
                      handling, reduced-motion still), non-blocking program link,
                      palette, types
    scene/            pure, seeded shape generators (pixels, voxel cube, shaft, network)
    glsl/             shared GLSL chunks (simplex noise, soft point)
    renderers/        particles (hero), lattice (AI section), registry
```

Only the canvases and the illustrative parts counter are client components;
everything else renders on the server. The scenes start when the browser is
idle after hydration. Each scene reports its state as `data-webgl` on its
container (the hero `<section>`, the AI `<figure>`), not on the canvas:

- `"on"`: drawing.
- `"lost"`: the GPU context dropped. Layout stays as it is (the hero readout is
  hidden, the AI figure keeps its box), and the scene remounts when the context
  is restored.
- `"off"`: no WebGL2, a failed mount, or no restore within `RESTORE_TIMEOUT_MS`
  (src/components/scene/mountScene.ts). The AI figure collapses; the hero keeps
  its layout.

Section links use `/#id`, so the nav works from any route, including the 404
page. `/projects`, the old portfolio route, redirects permanently to `/#story`.

## Theming

Components use token utilities only (`bg-ground`, `text-muted`,
`border-hairline`, `bg-accent`…); ESLint rejects static `style={{}}` objects. Each
utility resolves to a `--pk-*` custom property, so a theme is a block of
variables plus a registry entry.

To add a theme:

1. In `src/app/globals.css`, add a block that sets every `--pk-*` variable that
   `[data-theme="signal"]` sets:

   ```css
   [data-theme="blueprint"] {
     color-scheme: light;
     --pk-ground: #efeee9;
     --pk-ink: #15171c;
     --pk-accent: #e8590c;
     /* …every other --pk-* token */
   }
   ```

   The WebGL renderers read `--pk-ground`, `--pk-ink`, `--pk-muted` and
   `--pk-accent` at mount; any CSS colour works (a token that fails to parse
   logs a warning and falls back).
2. In `src/theme/themes.ts`, register it with a label, a hero renderer, its
   colour scheme and a `swatch` of those four colours as literals (used where
   CSS cannot reach: theme-color, the social card, the apple icon).
3. Set `data-theme` on `<html>` (the layout uses `defaultTheme`). The scenes
   remount and recolour whenever the attribute changes.

To add a hero renderer (for example a line-art or dither look):

1. Implement `SceneRenderer` from `src/webgl/core/types.ts`: an async
   `mount(canvas, options)` and `dispose()`, plus whichever of `setPointer`,
   `setScroll` and `setSafeZone` it uses. Build it on `createStage(canvas)` (it
   takes no options) so it gets the shared context, resizing, the idle loop,
   the pause on context loss and the reduced-motion still for free; link with
   `linkProgram`; and draw the same scene from `buildMorphScene` /
   `src/webgl/scene/shapes.ts`. `mountScene` owns restore and remounting.
2. Add its id to `HeroRendererId` in `themes.ts`, register its factory in
   `src/webgl/renderers/index.ts`, and point a theme at it.

`dispose()` must free everything it created but must not lose the WebGL
context: React StrictMode mounts, disposes and mounts again on the same canvas.

## Content

Copy lives in `src/content/site.ts` and nowhere else. A translation (for
example `/pt`) is a second object of the same `SiteContent` type. Adding one
means a locale route segment and handing each section the content for that
locale instead of importing `site` directly; the markup stays the same.

## Analytics

Self-hosted Umami at https://umami.undrd.app (website "pixelkiller"), loaded by
`src/components/Analytics.tsx`. It is cookieless, so there is no consent
banner. `data-domains` is the hostname of `site.url`, so only the production
domain is counted: localhost and Vercel preview deployments send nothing.

Page views are automatic. Clicks are tracked per link: give a `Link` in
`src/content/site.ts` an `event` name and the component renders it as
`data-event`, which Analytics reports with `umami.track()`. It deliberately
avoids Umami's `data-umami-event`, which holds same-tab links (in-page jumps,
mailto) until its request finishes. Current events: `cta-see-ventures`,
`cta-get-in-touch`, `cta-pitch-problem`, `contact-email`, `outbound-undrd`,
`outbound-linkedin`, `outbound-github`.
