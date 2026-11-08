import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className }: StaggerProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: StaggerProps) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
