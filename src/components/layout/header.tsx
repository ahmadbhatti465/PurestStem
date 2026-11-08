"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop/products", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/shop/about", label: "About" },
  { href: "/shop/contact", label: "Contact" },
];

const iconButton =
  "relative flex h-11 w-11 items-center justify-center rounded-full text-green-950 transition-colors hover:bg-green-100";

export default function Header() {
  const { data: session } = useSession();
  const { itemCount, setIsOpen } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  // Close overlays when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchOpen]);

  // Customers have the "user" role; every other role belongs to staff.
  const accountHref = session && session.user.role !== "user" ? "/admin" : null;

  return (
    <>
      <header className="header-lift sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
          <Link href="/" className="shrink-0" aria-label="PurestStem home">
            <Image
              src="/pureststem_logo.png"
              alt="PurestStem"
              width={1082}
              height={380}
              sizes="160px"
              className="h-11 w-auto lg:h-14"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "nav-link rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-green-100 text-green-950"
                    : "text-gray-700 hover:text-green-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            {searchOpen ? (
              <form ref={searchRef} action="/shop/products" className="hidden items-center md:flex">
                <input
                  name="search"
                  type="search"
                  autoFocus
                  placeholder="Search products"
                  aria-label="Search products"
                  className="field !min-h-10 w-56 !rounded-full !py-2 !text-sm"
                />
                <button
                  type="button"
                  className={iconButton}
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                className={cn(iconButton, "hidden md:flex")}
                aria-label="Open search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" strokeWidth={1.75} />
              </button>
            )}

            {session ? (
              <div className="hidden items-center sm:flex">
                {accountHref && (
                  <Link href={accountHref} className={iconButton} aria-label="Admin dashboard">
                    <User className="h-5 w-5" strokeWidth={1.75} />
                  </Link>
                )}
                <button
                  type="button"
                  className={iconButton}
                  aria-label="Sign out"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <Link href="/login" className={cn(iconButton, "hidden sm:flex")} aria-label="Sign in">
                <User className="h-5 w-5" strokeWidth={1.75} />
              </Link>
            )}

            <button
              type="button"
              className={iconButton}
              onClick={() => setIsOpen(true)}
              aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-900 px-1 text-[11px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={cn(iconButton, "lg:hidden")}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu stays mounted so opening it is instant and animated by CSS. */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-green-950/50 transition-opacity duration-200 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-green-50 transition-transform duration-300 ease-out lg:hidden",
          menuOpen ? "translate-x-0" : "invisible translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <span className="font-display text-xl text-green-950">Menu</span>
          <button
            type="button"
            className={iconButton}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block border-b border-line py-4 font-display text-2xl",
                isActive(link.href) ? "text-green-800" : "text-green-950"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 border-t border-line p-4">
          <form action="/shop/products" className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-green-800" aria-hidden="true" />
            <input
              name="search"
              type="search"
              placeholder="Search products"
              aria-label="Search products"
              className="field !rounded-full !pl-11"
            />
          </form>
          {session ? (
            <button
              type="button"
              className="flex min-h-11 items-center gap-2 text-sm font-medium text-gray-700"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center gap-2 text-sm font-medium text-gray-700"
            >
              <User className="h-4 w-4" aria-hidden="true" /> Sign in
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
