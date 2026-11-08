"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIMIZABLE_HOST = /\.public\.blob\.vercel-storage\.com$/;

function normalizeSrc(src: string) {
  return /^(https?:|data:|\/)/.test(src) ? src : `/${src}`;
}

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZABLE_HOST.test(new URL(src).hostname);
  } catch {
    return false;
  }
}

type SmartImageProps = Omit<ImageProps, "src"> & { src?: string | null };

/**
 * next/image for store-managed URLs, built so a product photo never takes the
 * page down: unknown hosts (admins can paste any address) are served as-is, a
 * failed optimization retries the original file, and a genuinely broken file
 * becomes a neat placeholder.
 */
export function SmartImage({ src, alt, className, ...props }: SmartImageProps) {
  const [failure, setFailure] = useState<{ src: string; attempts: number } | null>(null);
  const attempts = src && failure?.src === src ? failure.attempts : 0;
  const url = src ? normalizeSrc(src) : null;
  const optimizable = url !== null && canOptimize(url);

  if (!url || attempts >= (optimizable ? 2 : 1)) {
    return (
      <div
        {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
        className={cn(
          "flex h-full w-full items-center justify-center bg-green-100/50 text-green-700/40",
          props.fill && "absolute inset-0"
        )}
      >
        <Leaf className="h-1/4 max-h-16 w-1/4 max-w-16" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <Image
      key={attempts}
      src={url}
      alt={alt}
      className={className}
      unoptimized={!optimizable || attempts > 0}
      onError={() => setFailure({ src: src!, attempts: attempts + 1 })}
      {...props}
    />
  );
}
