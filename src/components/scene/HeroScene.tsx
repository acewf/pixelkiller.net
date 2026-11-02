"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import type { ThemeDefinition } from "@/theme/themes";
import type { SceneRenderer } from "@/webgl/core/types";
import { heroRenderers } from "@/webgl/renderers";
import { mountScene, type SceneController } from "./mountScene";

const selectHeroRenderer = (theme: ThemeDefinition) => heroRenderers[theme.renderer];

/** Client coordinates to canvas NDC (y up), or null before layout. */
function toCanvasNdc(canvas: HTMLCanvasElement, clientX: number, clientY: number): [number, number] | null {
  const r = canvas.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  return [((clientX - r.left) / r.width) * 2 - 1, 1 - ((clientY - r.top) / r.height) * 2];
}

/**
 * The hero section and its WebGL scene. State is written to the section as
 * `data-webgl`, `data-phase` and `--pk-phase-progress`, so the readout inside
 * it stays plain server-rendered markup styled from globals.css.
 */
export function HeroScene({ labelledBy, children }: { labelledBy: string; children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<SceneController | null>(null);
  /** Last pointer position (client px) while it is over the hero. */
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const headline = section.querySelector<HTMLElement>("[data-hero-safe]");
    let live: SceneRenderer | null = null;
    let phase = -1;

    // Keep the particles quiet behind the headline.
    const updateSafeZone = () => {
      if (!live?.setSafeZone || !headline) return;
      const c = canvas.getBoundingClientRect();
      const h = headline.getBoundingClientRect();
      if (!c.width || !c.height) return;
      live.setSafeZone({
        x0: ((h.left - c.left) / c.width) * 2 - 1,
        x1: ((h.right - c.left) / c.width) * 2 - 1,
        y0: 1 - ((h.bottom - c.top) / c.height) * 2,
        y1: 1 - ((h.top - c.top) / c.height) * 2,
      });
    };

    // Scrolling past the hero disperses the field; a resting pointer moves with the page.
    const updateScroll = () => {
      const r = section.getBoundingClientRect();
      live?.setScroll?.(r.height > 0 ? Math.min(1, Math.max(0, -r.top / r.height)) : 0);
      const pointer = pointerRef.current;
      const ndc = pointer && toCanvasNdc(canvas, pointer.x, pointer.y);
      if (ndc) live?.setPointer?.(ndc[0], ndc[1], true);
    };

    const controller = mountScene(canvas, selectHeroRenderer, {
      onPhase: (state) => {
        if (state.phase !== phase) {
          phase = state.phase;
          section.dataset.phase = String(state.phase);
        }
        section.style.setProperty("--pk-phase-progress", state.progress.toFixed(4));
      },
      onStatus: (status, renderer) => {
        live = renderer;
        phase = -1;
        section.dataset.webgl = status;
        updateSafeZone();
        updateScroll();
      },
    });
    controllerRef.current = controller;

    const resizeObserver = new ResizeObserver(updateSafeZone);
    resizeObserver.observe(canvas);
    if (headline) resizeObserver.observe(headline);
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScroll);
      resizeObserver.disconnect();
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
    const canvas = canvasRef.current;
    const ndc = canvas && toCanvasNdc(canvas, event.clientX, event.clientY);
    if (ndc) controllerRef.current?.renderer()?.setPointer?.(ndc[0], ndc[1], true);
  };

  // Release where the pointer last was: no jump to the centre while the field relaxes.
  const onPointerLeave = () => {
    const last = pointerRef.current;
    pointerRef.current = null;
    const canvas = canvasRef.current;
    const ndc = last && canvas && toCanvasNdc(canvas, last.x, last.y);
    controllerRef.current?.renderer()?.setPointer?.(ndc ? ndc[0] : 0, ndc ? ndc[1] : 0, false);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby={labelledBy}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex min-h-[860px] flex-col overflow-hidden bg-ground max-[720px]:min-h-[960px]"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block size-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] bg-linear-to-b from-ground/0 to-ground/86"
      />
      {children}
    </section>
  );
}
