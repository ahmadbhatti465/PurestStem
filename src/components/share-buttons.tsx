"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { SITE_URL } from "@/lib/site";

interface ShareButtonsProps {
  url: string;
  text?: string;
  className?: string;
  size?: "sm" | "md";
}

export function ShareButtons({ url, text = "Check this out", className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  const links = [
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} — ${fullUrl}`)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}` },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; the share links still work.
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-green-900 ${className ?? ""}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
          className="flex min-h-11 items-center underline-offset-4 hover:underline"
        >
          {link.name}
        </a>
      ))}
      <button type="button" onClick={copyLink} className="flex min-h-11 items-center gap-1.5 underline-offset-4 hover:underline">
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
