"use client";

import { useEffect, useRef } from "react";

/** Counts up to a value like "50,000+" when seen. Renders the final value on the server. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const match = value.match(/^([\d,]+)(.*)$/);
    if (!element || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    const grouped = digits.includes(",");
    // Years count over a short range instead of from zero.
    const from = target > 1000 && !grouped ? target - 64 : 0;
    const format = (n: number) => `${grouped ? n.toLocaleString("en-US") : n}${suffix}`;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1500, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = format(Math.round(from + (target - from) * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
