"use client";

import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

const positionClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export default function Tooltip({
  children,
  content,
  position = "top",
}: TooltipProps) {
  const tooltipId = `tooltip-${content.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <span
      className="group/tooltip relative inline-flex"
      tabIndex={0}
      aria-describedby={tooltipId}
    >
      {children}
      <span
        role="tooltip"
        id={tooltipId}
        className={`absolute ${positionClasses[position]} pointer-events-none z-50 w-max max-w-[200px] rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 invisible group-hover/tooltip:visible group-focus-within/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100`}
      >
        {content}
      </span>
    </span>
  );
}
