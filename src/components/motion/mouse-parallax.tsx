"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Publishes the pointer position as --mx/--my (-1 to 1) for CSS parallax layers. */
export function MouseParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty("--mx", String((event.clientX / window.innerWidth - 0.5) * 2));
        element.style.setProperty("--my", String((event.clientY / window.innerHeight - 0.5) * 2));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
