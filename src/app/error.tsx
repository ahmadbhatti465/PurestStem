"use client";

import { useEffect } from "react";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-green-50 px-4 py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="heading-lg mt-4 text-green-950">This page didn&apos;t load</h1>
      <p className="mt-3 max-w-md text-gray-600">
        Please try again. If it keeps happening, message us on WhatsApp at 0333 4117668.
      </p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">
        Try again
      </button>
    </section>
  );
}
