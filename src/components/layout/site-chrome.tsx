"use client";

import { usePathname } from "next/navigation";
import PromoBar from "./promo-bar";
import Header from "./header";
import Footer from "./footer";
import CartDrawer from "../cart-drawer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
