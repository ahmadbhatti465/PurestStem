import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  className?: string;
}

/** Fades content in as it scrolls into view, using CSS only (see `.reveal`). */
export function FadeIn({ children, className }: FadeInProps & Record<string, unknown>) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
