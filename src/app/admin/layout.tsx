import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isStaffRole } from "@/lib/admin-roles";
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

  if (!session || !isStaffRole(session.user.role)) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar role={session.user.role} />
      <div className="flex-1 min-w-0 lg:ml-64">
        <div className="p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">{children}</div>
      </div>
    </div>
  );
}
