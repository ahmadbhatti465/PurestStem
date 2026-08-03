import { cn } from "@/lib/utils";
import { type ReactNode, type ElementType } from "react";
import { type LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
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
  eyebrowIcon: EyebrowIcon,
  title,
  subtitle,
  align = "center",
  action,
  className,
  titleAs: TitleComponent = "h2",
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "text-center items-center" : "text-left items-start",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium w-fit",
            light
              ? "bg-white/10 text-green-100 border border-white/10 backdrop-blur-sm"
              : "bg-green-100 text-green-800"
          )}
        >
          {EyebrowIcon && <EyebrowIcon className="w-4 h-4" />}
          {eyebrow}
        </span>
      )}
      <div className={cn("flex flex-col gap-3", align === "center" ? "items-center" : "items-start", action && "sm:flex-row sm:items-end sm:justify-between sm:w-full")}>
        <div className={cn("flex flex-col gap-3", align === "center" ? "items-center" : "items-start")}>
          <TitleComponent
            className={cn(
              "font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
              light ? "text-white" : "text-gray-900"
            )}
          >
            {title}
          </TitleComponent>
          {subtitle && (
            <p
              className={cn(
                "max-w-2xl text-base md:text-lg",
                light ? "text-green-100/80" : "text-gray-600"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
