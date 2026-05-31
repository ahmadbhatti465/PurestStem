"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Leaf,
  Search,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop/products", label: "Products" },
  { href: "/shop/blog", label: "Blog" },
  { href: "/shop/about", label: "About" },
  { href: "/shop/contact", label: "Contact" },
];

export default function Header() {
  const { data: session } = useSession();
  const { itemCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[4.5rem]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1a4a2e] flex items-center justify-center shadow-md shadow-green-900/20 group-hover:shadow-green-900/30 transition-shadow">
                <Leaf className="w-5 h-5 text-[#c8e8a8] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#1a4a2e] to-[#2d6a4f] bg-clip-text text-transparent hidden sm:inline">
                PurestStem
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-[#1a4a2e] bg-green-50"
                        : "text-gray-600 hover:text-[#1a4a2e] hover:bg-green-50/60"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute left-4 right-4 -bottom-0.5 h-0.5 bg-gradient-to-r from-[#2d6a4f] to-[#4a9060] rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link
                href="/shop/products"
                className="hidden sm:flex p-2.5 text-gray-500 hover:text-[#2d6a4f] transition-colors rounded-xl hover:bg-green-50"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              {session ? (
                <Link
                  href="/admin"
                  className="hidden sm:flex p-2.5 text-gray-500 hover:text-[#2d6a4f] transition-colors rounded-xl hover:bg-green-50"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex p-2.5 text-gray-500 hover:text-[#2d6a4f] transition-colors rounded-xl hover:bg-green-50"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {session && (
                <button
                  onClick={() => signOut()}
                  className="hidden lg:flex p-2.5 text-gray-500 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 text-gray-500 hover:text-[#2d6a4f] transition-colors rounded-xl hover:bg-green-50"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[1.15rem] h-[1.15rem] px-1 bg-gradient-to-br from-[#2d6a4f] to-[#1a4a2e] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                className="md:hidden p-2.5 ml-1 rounded-xl text-gray-600 hover:text-[#1a4a2e] hover:bg-green-50 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-[min(320px,85vw)] bg-white z-50 shadow-2xl md:hidden flex flex-col"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between p-5 border-b border-green-100">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2d6a4f] to-[#1a4a2e] flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#c8e8a8]" />
                  </div>
                  <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-[#1a4a2e] to-[#2d6a4f] bg-clip-text text-transparent">
                    PurestStem
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-[#1a4a2e] hover:bg-green-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile nav links */}
              <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
                {navLinks.map((link, i) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-[#1a4a2e] bg-green-50 shadow-sm"
                            : "text-gray-600 hover:text-[#1a4a2e] hover:bg-green-50/60"
                        }`}
                      >
                        {link.label}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#2d6a4f] to-[#4a9060]" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile footer actions */}
              <div className="p-5 border-t border-green-100 space-y-3">
                <Link
                  href="/shop/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#1a4a2e] hover:bg-green-50/60 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search Products
                </Link>
                {session ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#1a4a2e] hover:bg-green-50/60 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
