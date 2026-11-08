import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
}

/** Endless ticker. The second copy is decorative and hidden from assistive tech. */
export function Marquee({ children, reverse = false, duration = 40, className }: MarqueeProps) {
  return (
    <div
      className={cn("marquee", reverse && "marquee-reverse", className)}
      style={{ "--marquee-dur": `${duration}s` } as CSSProperties}
    >
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden="true" inert>
        {children}
      </div>
    </div>
  );
}
