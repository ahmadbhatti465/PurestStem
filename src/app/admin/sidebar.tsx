"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, Package, FolderTree, FileText, Users, ArrowLeft, Leaf, Mail, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-64 bg-green-900 text-white fixed h-full flex flex-col z-40">
      <div className="p-6 border-b border-green-800">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-6 h-6 text-green-400" />
          <span className="text-lg font-bold">PurestStem</span>
        </div>
        <p className="text-xs text-green-300">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = mounted && (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-800 text-white"
                  : "text-green-200 hover:bg-green-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-green-800 space-y-1">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Site
        </Link>
      </div>
    </div>
  );
}
