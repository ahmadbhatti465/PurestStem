import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import { ChevronRight, Home } from "lucide-react";
import JsonLd from "@/components/json-ld";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: "Home", href: "/" }, ...items]
    : items;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("py-4", className)}>
      <JsonLd data={structuredData} />
      <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={item.label + index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    "flex items-center gap-1.5",
                    isLast ? "text-gray-900 font-medium truncate max-w-[200px]" : "text-gray-500"
                  )}
                >
                  {index === 0 && showHome && <Home className="w-4 h-4" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 hover:text-green-700 transition-colors"
                >
                  {index === 0 && showHome && <Home className="w-4 h-4" />}
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
