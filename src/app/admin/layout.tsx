import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "./sidebar";
import AdminLogin from "@/components/admin-login";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
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
