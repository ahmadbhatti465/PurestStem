import { Plus } from "lucide-react";
import { ReactNode } from "react";

interface AccordionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg text-green-950 [&::-webkit-details-marker]:hidden">
        {title}
        <Plus className="h-5 w-5 shrink-0 text-green-800 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}
