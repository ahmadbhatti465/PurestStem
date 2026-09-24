import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "./sidebar";
import AdminLogin from "@/components/admin-login";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const adminRoles = [
    "admin", "analytics_manager", "order_manager", "product_manager",
    "category_manager", "blog_manager", "user_manager", "message_manager",
  ];

  if (!session || !adminRoles.includes(session.user.role)) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
