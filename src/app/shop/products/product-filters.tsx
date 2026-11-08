import Link from "next/link";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
}

function hrefFor(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  const query = params.toString();
  return query ? `/shop/products?${query}` : "/shop/products";
}

const pill = "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors";
const pillActive = "bg-green-900 text-white";
const pillIdle = "bg-white text-gray-700 ring-1 ring-inset ring-line hover:text-green-900";

export default function ProductFilters({ categories, currentCategory, currentSearch }: ProductFiltersProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center">
      <form action="/shop/products" method="GET" className="relative w-full md:w-64 md:shrink-0" role="search">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
        <input
          name="search"
          type="search"
          defaultValue={currentSearch || ""}
          placeholder="Search products"
          aria-label="Search products"
          className="field !min-h-10 !rounded-full !py-2 !pl-10 !pr-10 md:!text-sm"
        />
        {currentSearch && (
          <Link
            href={hrefFor(currentCategory)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Link>
        )}
        {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
      </form>

      <nav aria-label="Product categories" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 md:mx-0 md:px-0.5">
        <Link
          href={hrefFor(undefined, currentSearch)}
          aria-current={!currentCategory ? "page" : undefined}
          className={cn(pill, !currentCategory ? pillActive : pillIdle)}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={hrefFor(category.slug, currentSearch)}
            aria-current={currentCategory === category.slug ? "page" : undefined}
            className={cn(pill, currentCategory === category.slug ? pillActive : pillIdle)}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
