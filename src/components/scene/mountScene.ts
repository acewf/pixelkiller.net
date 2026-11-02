import { resolveTheme, type ThemeDefinition } from "@/theme/themes";
import { readScenePalette } from "@/webgl/core/palette";
import { isCanvasContextLost } from "@/webgl/core/stage";
import type { PhaseState, RendererFactory, SceneRenderer } from "@/webgl/core/types";

/** A lost context the browser has not restored by then is treated as gone for good. */
const RESTORE_TIMEOUT_MS = 10_000;

export interface SceneController {
  /** The live renderer, or null while starting, while the context is lost, or without WebGL. */
  renderer(): SceneRenderer | null;
  dispose(): void;
}

/**
 * "on": drawing. "lost": the GPU context dropped and will come back (keep the
 * layout). "off": WebGL2 is unavailable or the scene failed to start.
 */
export type SceneStatus = "on" | "lost" | "off";

interface MountHooks {
  onPhase?: (state: PhaseState) => void;
  onStatus?: (status: SceneStatus, renderer: SceneRenderer | null) => void;
}

/** Runs `task` when the browser is idle (at the latest after `timeout` ms), off the hydration path. */
function whenIdle(task: () => void, timeout = 1200): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 200);
  return () => window.clearTimeout(id);
}

/**
 * Mounts the renderer the active theme asks for, coloured from the theme's
 * custom properties. Remounts when <html data-theme> changes and when a lost
 * WebGL context is restored.
 */
export function mountScene(
  canvas: HTMLCanvasElement,
  select: (theme: ThemeDefinition) => RendererFactory,
  hooks: MountHooks = {},
): SceneController {
  const root = document.documentElement;
  let renderer: SceneRenderer | null = null;
  let pending: SceneRenderer | null = null;
  let cancelIdle: (() => void) | null = null;
  let lost = false;
  let giveUp: number | undefined;

  const mount = () => {
    cancelIdle = null;
    if (lost) return; // the restore listener remounts
    const next = select(resolveTheme(root.dataset.theme))();
    pending = next;
    next
      .mount(canvas, { palette: readScenePalette(canvas), onPhase: hooks.onPhase })
      .catch((error: unknown) => {
        console.error("[webgl] mount failed", error);
        return false;
      })
      .then((ok) => {
        if (pending !== next) return; // unmounted meanwhile, and already disposed
        pending = null;
        if (ok) renderer = next;
        else next.dispose();
        // The context can read as lost before its loss event is delivered.
        hooks.onStatus?.(ok ? "on" : lost || isCanvasContextLost(canvas) ? "lost" : "off", renderer);
      });
  };
  const scheduleMount = () => {
    cancelIdle?.();
    cancelIdle = whenIdle(mount);
  };
  const unmount = () => {
    cancelIdle?.();
    cancelIdle = null;
    pending?.dispose();
    pending = null;
    renderer?.dispose();
    renderer = null;
  };

  // The controller owns context loss for its whole lifetime, so a loss during the
  // idle window or an in-flight link is still restorable and still remounts.
  const onContextLost = (event: Event) => {
    event.preventDefault(); // without this the browser never restores the context
    lost = true;
    unmount();
    hooks.onStatus?.("lost", null);
    window.clearTimeout(giveUp);
    giveUp = window.setTimeout(() => hooks.onStatus?.("off", null), RESTORE_TIMEOUT_MS);
  };
  const onContextRestored = () => {
    window.clearTimeout(giveUp);
    lost = false;
    unmount();
    scheduleMount();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  scheduleMount();
  const themeObserver = new MutationObserver(() => {
    unmount();
    scheduleMount();
  });
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  return {
    renderer: () => renderer,
    dispose() {
      window.clearTimeout(giveUp);
      themeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      unmount();
    },
  };
}
