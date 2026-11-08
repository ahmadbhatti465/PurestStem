import { cn } from "@/lib/utils";
import { type ReactNode, type ElementType } from "react";
import { type LucideIcon } from "lucide-react";
import { AnimatedText } from "@/components/motion/animated-text";

interface SectionHeaderProps {
  eyebrow?: string;
  /** Kept for existing callers; the new eyebrow style has no icon. */
  eyebrowIcon?: LucideIcon;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  titleAs?: ElementType;
  light?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  className,
  titleAs: TitleComponent = "h2",
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        action && "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("flex max-w-3xl flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && <span className={cn("eyebrow", light && "eyebrow-light")}>{eyebrow}</span>}
        <TitleComponent className={cn("heading-lg", light ? "text-white" : "text-green-950")}>
          {typeof title === "string" ? <AnimatedText mode="scroll" text={title} /> : title}
        </TitleComponent>
        {subtitle && (
          <p className={cn("max-w-2xl text-base sm:text-lg", light ? "text-green-100/85" : "text-gray-600")}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="reveal shrink-0">{action}</div>}
    </div>
  );
}
