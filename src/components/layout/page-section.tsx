import { cn } from "@/lib/utils";
import { Container } from "./container";
import { type ReactNode, type ElementType } from "react";

interface PageSectionProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "white" | "green" | "light" | "dark" | "none";
  padding?: "sm" | "md" | "lg" | "xl";
  id?: string;
}

const backgroundClasses = {
  white: "bg-white",
  green: "bg-[#132e1f] text-white",
  light: "bg-[#f9faf5]",
  dark: "bg-[#1a4a2e] text-white",
  none: "",
};

const paddingClasses = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-20",
};

export function PageSection({
  as: Component = "section",
  children,
  className,
  containerClassName,
  background = "white",
  padding = "lg",
  id,
}: PageSectionProps) {
  return (
    <Component
      id={id}
      className={cn(backgroundClasses[background], paddingClasses[padding], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </Component>
  );
}
