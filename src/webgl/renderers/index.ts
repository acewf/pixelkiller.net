import type { HeroRendererId } from "@/theme/themes";
import type { RendererFactory } from "../core/types";
import { createParticlesRenderer } from "./particles";

/** Hero renderers by id. A theme picks one in src/theme/themes.ts. */
export const heroRenderers: Record<HeroRendererId, RendererFactory> = {
  particles: createParticlesRenderer,
};

export { createLatticeRenderer } from "./lattice";
