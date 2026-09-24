"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-lime-300 origin-left shadow-[0_0_12px_rgba(74,222,128,0.7)]"
        style={{ scaleX }}
      />
    </div>
  );
}
