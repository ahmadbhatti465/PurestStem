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
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Close search on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-bar")) setSearchOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [searchOpen]);

  // Active pill indicator position
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  useEffect(() => {
    if (!navRef.current) return;
    const active = navRef.current.querySelector("[data-nav-active='true']") as HTMLElement;
    if (active) {
      setPillStyle({ left: active.offsetLeft, width: active.offsetWidth });
    }
  }, [pathname]);

  return (
    <>
      {/* ======= HEADER ======= */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/50 backdrop-blur-3xl shadow-[0_8px_32px_rgba(26,74,46,0.15)] border-b border-white/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group z-10">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#1a4a2e] flex items-center justify-center shadow-lg shadow-green-900/25"
              >
                <Leaf className="w-5 h-5 text-[#c8e8a8]" strokeWidth={2.5} />
                <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-[1.35rem] font-black tracking-tight bg-gradient-to-r from-[#1a4a2e] to-[#2d6a4f] bg-clip-text text-transparent">
                  PurestStem
                </span>
                <span className="text-[0.6rem] font-semibold tracking-[0.2em] text-[#4a9060] uppercase mt-0.5">
                  Nature. Purity. You.
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav
              ref={navRef}
              className="hidden lg:flex items-center relative"
            >
              {/* Sliding pill background */}
              <motion.div
                className="absolute top-0 h-full rounded-xl bg-green-50/80 border border-green-100/50 shadow-sm"
                animate={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                  opacity: pillStyle.width > 0 ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-nav-active={isActive}
                    className={`relative z-10 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                      isActive
                        ? "text-[#1a4a2e]"
                        : "text-gray-500 hover:text-[#1a4a2e]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* ── Actions ── */}
            <div className="flex items-center gap-1.5 z-10">
              {/* Search */}
              <div className="search-bar hidden md:flex items-center">
                <AnimatePresence>
                  {searchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 240, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      action="/shop/products"
                      className="overflow-hidden"
                    >
                      <input
                        name="search"
                        autoFocus
                        placeholder="Search products..."
                        className="w-full h-10 px-4 text-sm bg-green-50/60 border border-green-100 rounded-xl outline-none focus:ring-2 focus:ring-[#4a9060]/30 text-[#1a4a2e] placeholder:text-green-700/40"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 text-gray-500 hover:text-[#2d6a4f] transition-colors rounded-xl hover:bg-green-50/60"
                  aria-label="Search"
                >
                  {searchOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

              {/* Account / Sign Out */}
              {session ? (
                <div className="hidden sm:flex items-center gap-1">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Link
                      href="/admin"
                      className="flex p-2.5 text-gray-500 hover:text-[#2d6a4f] transition-colors rounded-xl hover:bg-green-50/60"
                      aria-label="Account"
                    >
                      <User className="w-5 h-5" strokeWidth={1.8} />
                    </Link>
                  </motion.div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex p-2.5 text-gray-500 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50/60"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-5 h-5" strokeWidth={1.8} />
                  </motion.button>
                </div>
              ) : (
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Link
                    href="/login"
                    className="hidden sm:flex p-2.5 text-gray-500 hover:text-[#2d6a4f] transition-colors rounded-xl hover:bg-green-50/60"
                    aria-label="Sign In"
                  >
                    <User className="w-5 h-5" strokeWidth={1.8} />
                  </Link>
                </motion.div>
              )}

              {/* Cart */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 text-gray-500 hover:text-[#2d6a4f] transition-colors rounded-xl hover:bg-green-50/60"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={1.8} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0, y: 5 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -top-1 -right-1 min-w-[1.25rem] h-[1.25rem] px-1 bg-gradient-to-br from-[#2d6a4f] to-[#1a4a2e] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-green-900/20 border-2 border-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2.5 ml-0.5 rounded-xl text-gray-600 hover:text-[#1a4a2e] hover:bg-green-50/60 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ======= MOBILE DRAWER ======= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#1a4a2e]/40 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-gradient-to-b from-white to-[#f9faf5] z-50 lg:hidden flex flex-col shadow-2xl shadow-green-900/20"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-green-100/60">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1a4a2e] flex items-center justify-center shadow-md shadow-green-900/20">
                    <Leaf className="w-5 h-5 text-[#c8e8a8]" strokeWidth={2.5} />
                  </div>
                  <div className="leading-none">
                    <span className="text-lg font-black tracking-tight bg-gradient-to-r from-[#1a4a2e] to-[#2d6a4f] bg-clip-text text-transparent block">
                      PurestStem
                    </span>
                    <span className="text-[0.55rem] font-semibold tracking-[0.2em] text-[#4a9060] uppercase mt-0.5 block">
                      Nature. Purity. You.
                    </span>
                  </div>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-[#1a4a2e] hover:bg-green-50 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {navLinks.map((link, i) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, type: "spring" }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? "text-white bg-gradient-to-r from-[#2d6a4f] to-[#1a4a2e] shadow-lg shadow-green-900/20"
                            : "text-gray-600 hover:text-[#1a4a2e] hover:bg-green-50/80"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active-dot"
                              className="w-1.5 h-1.5 rounded-full bg-[#c8e8a8]"
                            />
                          )}
                          {link.label}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isActive
                              ? "text-[#c8e8a8]"
                              : "text-gray-300 group-hover:translate-x-1 group-hover:text-[#4a9060]"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer Actions */}
              <div className="p-6 border-t border-green-100/60 space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <form
                    action="/shop/products"
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-50/60 border border-green-100/50"
                  >
                    <Search className="w-4 h-4 text-[#4a9060]" />
                    <input
                      name="search"
                      placeholder="Search products..."
                      className="flex-1 bg-transparent text-sm text-[#1a4a2e] placeholder:text-green-700/30 outline-none"
                    />
                  </form>
                </motion.div>

                {session ? (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold text-gray-600 hover:text-[#1a4a2e] hover:bg-green-50/80 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
