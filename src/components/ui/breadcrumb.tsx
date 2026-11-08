import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  light?: boolean;
}

/** Visible trail only. Pages add their own BreadcrumbList JSON-LD where indexed. */
export function Breadcrumb({ items, className, light = false }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] =
    items[0]?.label === "Home" ? items : [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", light ? "text-green-100/80" : "text-gray-600")}>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn("max-w-[14rem] truncate", isLast && (light ? "text-white" : "text-green-950"))}
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={cn("transition-colors", light ? "hover:text-white" : "hover:text-green-900")}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
