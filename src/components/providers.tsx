"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/hooks/use-cart";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
