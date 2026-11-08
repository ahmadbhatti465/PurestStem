import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | PurestStem",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-green-50 px-4 py-20 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="heading-lg mt-4 text-green-950">We couldn&apos;t find that page</h1>
      <p className="mt-3 max-w-md text-gray-600">
        It may have moved, or the link might be out of date. Our herbal range is just a click away.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop/products" className="btn btn-primary">
          Shop products
        </Link>
        <Link href="/" className="btn btn-outline">
          Back to home
        </Link>
      </div>
    </section>
  );
}
