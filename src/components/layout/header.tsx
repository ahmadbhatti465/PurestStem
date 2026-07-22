"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
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
    const t = setTimeout(() => {
      setMobileMenuOpen(false);
      setSearchOpen(false);
    }, 0);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-bar")) setSearchOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [searchOpen]);

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
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white shadow-lg border-b border-gray-100" : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            <Link href="/" className="flex items-center gap-3 group z-10">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                src="/pureststem_logo.png"
                alt="PurestStem - Premium Herbal Products Pakistan"
                className="h-12 w-auto"
              />
            </Link>

            <nav ref={navRef} className="hidden lg:flex items-center relative" aria-label="Main navigation">
              <motion.div
                className="absolute top-0 h-full rounded-xl bg-green-100 border border-green-200 shadow-sm"
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
                        ? "text-green-800"
                        : "text-gray-600 hover:text-green-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 z-10">
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
                        aria-label="Search products"
                        className="w-full h-10 px-4 text-sm bg-gray-100 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/30 text-gray-900 placeholder:text-gray-400"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 text-gray-600 hover:text-green-700 transition-colors rounded-xl hover:bg-green-50"
                  aria-label={searchOpen ? "Close search" : "Open search"}
                >
                  {searchOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

              {session ? (
                <div className="hidden sm:flex items-center gap-1">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Link
                      href="/admin"
                      className="flex p-2.5 text-gray-600 hover:text-green-700 transition-colors rounded-xl hover:bg-green-50"
                      aria-label="Account"
                    >
                      <User className="w-5 h-5" strokeWidth={1.8} />
                    </Link>
                  </motion.div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex p-2.5 text-gray-600 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-5 h-5" strokeWidth={1.8} />
                  </motion.button>
                </div>
              ) : (
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Link
                    href="/login"
                    className="hidden sm:flex p-2.5 text-gray-600 hover:text-green-700 transition-colors rounded-xl hover:bg-green-50"
                    aria-label="Sign In"
                  >
                    <User className="w-5 h-5" strokeWidth={1.8} />
                  </Link>
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 text-gray-600 hover:text-green-700 transition-colors rounded-xl hover:bg-green-50"
                aria-label={`Cart with ${itemCount} items`}
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
                      className="absolute -top-1 -right-1 min-w-[1.25rem] h-[1.25rem] px-1 bg-green-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2.5 ml-0.5 rounded-xl text-gray-600 hover:text-green-800 hover:bg-green-50 transition-colors"
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img
                    src="/pureststem_logo.png"
                    alt="PurestStem"
                    className="h-12 w-auto"
                  />
                </Link>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </div>

              <nav className="flex-1 p-6 space-y-2 overflow-y-auto" aria-label="Mobile navigation">
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
                            ? "text-white bg-gradient-to-r from-green-700 to-green-900 shadow-lg shadow-green-900/20"
                            : "text-gray-700 hover:text-green-800 hover:bg-green-50"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active-dot"
                              className="w-1.5 h-1.5 rounded-full bg-green-200"
                            />
                          )}
                          {link.label}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isActive
                              ? "text-green-200"
                              : "text-gray-300 group-hover:translate-x-1 group-hover:text-green-600"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-gray-100 space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <form
                    action="/shop/products"
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200"
                  >
                    <Search className="w-4 h-4 text-green-600" />
                    <input
                      name="search"
                      placeholder="Search products..."
                      aria-label="Search products"
                      className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
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
                      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold text-gray-700 hover:text-green-800 hover:bg-green-50 transition-colors"
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
