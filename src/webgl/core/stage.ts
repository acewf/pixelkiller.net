export interface StageFrame {
  /** Seconds since the stage started, unwrapped (JS doubles): use for phases and rotations. 0 while still. */
  time: number;
  /**
   * Seconds for shader uniforms, kept small for float32: rebased only while the
   * canvas is off-screen, so the jump is never seen. 0 while still.
   */
  shaderTime: number;
  /** Drawing-buffer size in device pixels (what the browser actually allocated). */
  width: number;
  height: number;
  dpr: number;
  /** prefers-reduced-motion: one representative frame, redrawn only on change. */
  still: boolean;
}

/** A WebGL2 context plus the render loop every renderer shares. */
export interface Stage {
  readonly gl: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;
  /** True once the context has been lost: GL objects made before that died with it. */
  readonly contextLost: boolean;
  start(draw: (frame: StageFrame) => void): void;
  /** Request a redraw (needed while still or after an input changes). */
  invalidate(): void;
  /** Stops the loop and observers. Leaves the context alive so the canvas can be mounted again. */
  dispose(): void;
}

/**
 * The one attribute set every renderer gets. A canvas keeps the attributes of
 * its first getContext call, so a renderer remounted on the same canvas
 * (StrictMode, theme change, context restore) must ask for exactly these:
 * opaque, no MSAA, no depth or stencil (the scenes are additive point clouds),
 * and no context at all rather than a software-rendered one.
 */
const CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: false,
  failIfMajorPerformanceCaveat: true,
};

/**
 * Whether the canvas's context is lost. Asks with the stage's own attributes, so
 * the check can never create a context configured any other way.
 */
export function isCanvasContextLost(canvas: HTMLCanvasElement): boolean {
  return canvas.getContext("webgl2", CONTEXT_ATTRIBUTES)?.isContextLost() ?? false;
}

const MAX_DPR = 1.5;
/** Rebase the shader clock once it is this old (s), but only while off-screen. */
const SHADER_REBASE_AFTER = 3600;
/** Hard wrap (s), reachable only by a canvas left on screen for a whole day. */
const SHADER_WRAP = 86_400;

/** Leaves the shared context clean for whichever renderer mounts next. */
function resetState(gl: WebGL2RenderingContext) {
  gl.disable(gl.BLEND);
  gl.useProgram(null);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

/**
 * Creates the stage on `canvas`. A lost context pauses drawing; remounting on
 * restore (with fresh GL objects) is the owner's job, see mountScene.
 */
export function createStage(canvas: HTMLCanvasElement): Stage | null {
  const gl = canvas.getContext("webgl2", CONTEXT_ATTRIBUTES);
  if (!gl || gl.isContextLost()) return null;
  resetState(gl);

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let still = motion.matches;
  let visible = false; // until the IntersectionObserver reports
  let dirty = true;
  let lost = false;
  let disposed = false;
  let raf = 0;
  let draw: ((frame: StageFrame) => void) | null = null;
  const startedAt = performance.now();
  let shaderEpoch = startedAt;

  // Size comes from a ResizeObserver, so an idle stage never touches layout.
  let { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect();
  const backingSize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    return { dpr, width: Math.max(1, Math.round(cssWidth * dpr)), height: Math.max(1, Math.round(cssHeight * dpr)) };
  };

  const tick = () => {
    raf = 0;
    if (!draw || !visible || lost || disposed) return;
    const { dpr, width, height } = backingSize();
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      dirty = true;
    }
    if (still && !dirty) return;
    dirty = false;
    const now = performance.now();
    draw({
      time: still ? 0 : (now - startedAt) / 1000,
      shaderTime: still ? 0 : ((now - shaderEpoch) / 1000) % SHADER_WRAP,
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      dpr,
      still,
    });
    if (!still) schedule();
  };

  // Frames are requested only while there is something to draw: on screen, and
  // either animating or invalidated. Observers and invalidate() restart the loop.
  const schedule = () => {
    if (!raf && draw && visible && !lost && !disposed) raf = requestAnimationFrame(tick);
  };
  const invalidate = () => {
    dirty = true;
    schedule();
  };

  const onMotionChange = () => {
    still = motion.matches;
    invalidate();
  };
  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) visible = entry.isIntersecting;
    if (visible) invalidate();
    else if ((performance.now() - shaderEpoch) / 1000 > SHADER_REBASE_AFTER) shaderEpoch = performance.now();
  });
  const resize = new ResizeObserver((entries) => {
    const box = entries[entries.length - 1].contentRect;
    cssWidth = box.width;
    cssHeight = box.height;
    const { width, height } = backingSize();
    if (width !== canvas.width || height !== canvas.height) invalidate();
  });

  // A devicePixelRatio change (zoom, moving to another display) resizes nothing,
  // so watch the current ratio and re-arm the query after every change.
  let ratio: MediaQueryList | null = null;
  const onRatioChange = () => {
    watchRatio();
    invalidate();
  };
  const watchRatio = () => {
    ratio?.removeEventListener("change", onRatioChange);
    ratio = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    ratio.addEventListener("change", onRatioChange);
  };

  const onLost = (event: Event) => {
    event.preventDefault(); // lets the browser restore the context
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  motion.addEventListener("change", onMotionChange);
  visibility.observe(canvas);
  resize.observe(canvas);
  watchRatio();
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    gl,
    canvas,
    get contextLost() {
      return lost || gl.isContextLost();
    },
    start(fn) {
      draw = fn;
      schedule();
    },
    invalidate,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      raf = 0;
      visibility.disconnect();
      resize.disconnect();
      motion.removeEventListener("change", onMotionChange);
      ratio?.removeEventListener("change", onRatioChange);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (!gl.isContextLost()) resetState(gl);
    },
  };
}
