import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  variant?: "default" | "compact" | "inline";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const isCompact = variant === "compact";
  const isInline = variant === "inline";

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        isInline ? "py-8" : isCompact ? "py-12" : "py-20",
        className
      )}
    >
      <div
        className={cn(
          "bg-green-100 rounded-full flex items-center justify-center mb-4",
          isInline ? "w-12 h-12" : isCompact ? "w-16 h-16" : "w-24 h-24"
        )}
      >
        <Icon
          className={cn(
            "text-green-800",
            isInline ? "w-6 h-6" : isCompact ? "w-8 h-8" : "w-12 h-12"
          )}
        />
      </div>
      <h3
        className={cn(
          "font-display text-green-950",
          isInline ? "text-base" : isCompact ? "text-lg" : "text-xl md:text-2xl"
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "text-gray-600 mt-2 max-w-sm",
            isInline ? "text-sm" : "text-base"
          )}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
