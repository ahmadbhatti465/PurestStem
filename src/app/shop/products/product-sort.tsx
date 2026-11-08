"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function ProductSort() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentSort = searchParams.get("sort") || "featured";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex shrink-0 items-center gap-2 text-sm text-gray-600">
      Sort by
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-10 cursor-pointer rounded-full border border-line bg-white px-3 py-2 text-sm text-gray-800"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
