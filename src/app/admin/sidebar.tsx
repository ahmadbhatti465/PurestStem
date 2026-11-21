"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, ShoppingBag, Package, FolderTree, FileText, Users, ArrowLeft, Mail, LogOut, BarChart3,
  Menu, X,
} from "lucide-react";
import { canAccess, ROLE_LABELS, type AdminSection, type Role } from "@/lib/admin-roles";

const navItems: { href: string; label: string; icon: typeof LayoutDashboard; section: AdminSection }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, section: "analytics" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, section: "orders" },
  { href: "/admin/products", label: "Products", icon: Package, section: "products" },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, section: "categories" },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText, section: "blog" },
  { href: "/admin/users", label: "Users", icon: Users, section: "users" },
  { href: "/admin/messages", label: "Messages", icon: Mail, section: "messages" },
];

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const filteredItems = navItems.filter((item) => canAccess(role, item.section));

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-[#0f2e1c] text-white flex items-center justify-between px-4 z-40">
        <span className="text-sm font-semibold">PurestStem Admin</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`w-64 bg-[#0f2e1c] text-white fixed h-full flex flex-col z-50 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl px-2 py-1.5 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/pureststem_logo.png" alt="PurestStem" className="h-8 w-auto" />
            </div>
            <div>
              <p className="text-sm font-semibold">PurestStem</p>
              <p className="text-xs text-green-300/70">{ROLE_LABELS[role as Role] ?? "Admin Panel"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-green-700/60 to-green-800/40 text-white shadow-sm border border-green-600/30"
                    : "text-green-200/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-green-300" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-200/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
          {/* Plain <a> on purpose: a full load gives the storefront its own CSP. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-200/70 hover:bg-white/5 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </a>
        </div>
      </div>
    </>
  );
}
