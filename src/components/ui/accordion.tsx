"use client";

import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface AccordionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({
  title,
  children,
  icon,
  defaultOpen = false,
}: AccordionProps) {
  return (
    <details
      className="group rounded-2xl border border-gray-100 bg-white overflow-hidden"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-base font-semibold text-gray-900 list-none [&::-webkit-details-marker]:hidden transition-colors hover:bg-gray-50">
        <span className="flex items-center gap-2">
          {icon && <span className="text-green-600">{icon}</span>}
          {title}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
        <div className="overflow-hidden px-4 pb-4">
          {children}
        </div>
      </div>
    </details>
  );
}
