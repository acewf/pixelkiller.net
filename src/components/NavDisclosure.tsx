"use client";

import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

/**
 * The narrow-screen menu: a native <details> (works before hydration) that also
 * closes once a link is followed, on Escape, and on a tap outside, so the open
 * panel never lingers over the page after an in-page jump.
 */
export function NavDisclosure({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const details = ref.current;
      if (details?.open && !details.contains(event.target as Node)) details.open = false;
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const onClick = (event: MouseEvent<HTMLDetailsElement>) => {
    if (ref.current && (event.target as Element).closest("a")) ref.current.open = false;
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDetailsElement>) => {
    const details = ref.current;
    if (event.key !== "Escape" || !details?.open) return;
    details.open = false;
    details.querySelector("summary")?.focus();
  };

  return (
    <details ref={ref} className={className} onClick={onClick} onKeyDown={onKeyDown}>
      {children}
    </details>
  );
}
