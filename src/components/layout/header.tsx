"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Leaf, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";

export default function Header() {
  const { data: session } = useSession();
  const { itemCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop/products", label: "Products" },
    { href: "/shop/blog", label: "Blog" },
    { href: "/shop/about", label: "About" },
    { href: "/shop/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-700" />
              </div>
              <span className="text-xl font-bold text-green-800 hidden sm:inline">
                Khan Herbals
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/shop/products"
              className="p-2 text-gray-700 hover:text-green-700 transition-colors rounded-md hover:bg-gray-100"
            >
              <Search className="w-5 h-5" />
            </Link>

            {session ? (
              <div className="flex items-center gap-1">
                <Link href="/admin" className="p-2 text-gray-700 hover:text-green-700 transition-colors rounded-md hover:bg-gray-100">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-700 hover:text-green-700 hidden sm:block px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-gray-700 hover:text-green-700 transition-colors rounded-md hover:bg-gray-100"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-gray-700 hover:text-green-700 transition-colors rounded-md hover:bg-gray-100"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-700 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t bg-white overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block text-sm font-medium text-gray-700 hover:text-green-700 py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
