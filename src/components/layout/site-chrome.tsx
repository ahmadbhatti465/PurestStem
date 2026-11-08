"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./header";
import CartDrawer from "../cart-drawer";
import WhatsAppButton from "./whatsapp-button";

interface SiteChromeProps {
  children: ReactNode;
  /** Passed in from the server layout so they stay out of the client bundle. */
  promoBar: ReactNode;
  footer: ReactNode;
}

export default function SiteChrome({ children, promoBar, footer }: SiteChromeProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-green-900"
      >
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      {promoBar}
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {footer}
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
