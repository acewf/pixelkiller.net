export type Rgb = readonly [number, number, number];

/** Scene colours, read from the theme's --pk-* custom properties at mount. */
export interface ScenePalette {
  ground: Rgb;
  ink: Rgb;
  muted: Rgb;
  accent: Rgb;
}

/** Rectangle in normalised device coordinates (y up), x0 < x1 and y0 < y1. */
export interface NdcRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface PhaseState {
  /** Index of the shape to highlight; switches at the middle of each morph. */
  phase: number;
  /** 0..1 from the switch to `phase` until the switch to the next one (1 while still). */
  progress: number;
}

export interface RendererOptions {
  palette: ScenePalette;
  /** Called on every drawn frame. */
  onPhase?: (state: PhaseState) => void;
}

/**
 * A WebGL scene that can be swapped per theme. Everything except mount and
 * dispose is optional: a renderer ignores the inputs it has no use for.
 */
export interface SceneRenderer {
  /**
   * Resolves true once the renderer is drawing, false when WebGL2 or its
   * shaders are unavailable (or it was disposed first). dispose() is always safe.
   */
  mount(canvas: HTMLCanvasElement, options: RendererOptions): Promise<boolean>;
  /** Pointer in canvas NDC. Inactive keeps the last position and only releases it. */
  setPointer?(x: number, y: number, active: boolean): void;
  /** 0 with the scene's section at the top of the viewport, 1 once scrolled past it. */
  setScroll?(progress: number): void;
  /** Area to keep quiet behind foreground type, or null. */
  setSafeZone?(rect: NdcRect | null): void;
  dispose(): void;
}

export type RendererFactory = () => SceneRenderer;
