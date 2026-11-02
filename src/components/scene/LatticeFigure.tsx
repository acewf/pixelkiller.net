"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createLatticeRenderer } from "@/webgl/renderers";
import { mountScene } from "./mountScene";

const selectLattice = () => createLatticeRenderer;

/**
 * The AI section's rules → learning band. The canvas is decorative; the caption
 * (children) carries the meaning. Without WebGL ("off") the figure collapses
 * rather than leaving an empty box; a lost context ("lost") keeps the box, blank
 * until the scene comes back.
 */
export function LatticeFigure({ children }: { children: ReactNode }) {
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    const canvas = canvasRef.current;
    if (!figure || !canvas) return;
    const controller = mountScene(canvas, selectLattice, {
      onStatus: (status) => {
        figure.dataset.webgl = status;
      },
    });
    return () => controller.dispose();
  }, []);

  return (
    <figure
      ref={figureRef}
      className="relative mb-4 h-[300px] overflow-hidden border border-hairline bg-ground data-[webgl=off]:hidden"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block size-full" />
      {children}
    </figure>
  );
}
