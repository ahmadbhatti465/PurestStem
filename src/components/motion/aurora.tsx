import type { CSSProperties } from "react";
import { Leaf } from "lucide-react";

/** Slow-moving glow behind dark sections. */
export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

const LEAVES = [
  { left: "6%", size: 26, dur: "24s", delay: "-4s" },
  { left: "24%", size: 18, dur: "30s", delay: "-16s" },
  { left: "47%", size: 34, dur: "27s", delay: "-9s" },
  { left: "71%", size: 20, dur: "33s", delay: "-22s" },
  { left: "90%", size: 28, dur: "25s", delay: "-13s" },
];

export function FallingLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {LEAVES.map((leaf) => (
        <Leaf
          key={leaf.left}
          className="falling-leaf"
          strokeWidth={1.25}
          width={leaf.size}
          height={leaf.size}
          style={{ left: leaf.left, "--dur": leaf.dur, "--delay": leaf.delay } as CSSProperties}
        />
      ))}
    </div>
  );
}
