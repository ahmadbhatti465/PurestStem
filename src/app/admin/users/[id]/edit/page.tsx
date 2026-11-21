"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MIN_PASSWORD_LENGTH } from "@/lib/admin-roles";
import {
  BarChart3,
  ShoppingBag,
  Package,
  FolderTree,
  FileText,
  Users,
  Mail,
  Shield,
  User,
} from "lucide-react";

const roles = [
  {
    value: "user",
    label: "User",
    description: "Regular customer — can browse, order, and leave reviews",
    icon: User,
    color: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Full access to all admin panel sections and settings",
    icon: Shield,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  {
    value: "analytics_manager",
    label: "Analytics Manager",
    description: "View sales, revenue and order analytics",
    icon: BarChart3,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    value: "order_manager",
    label: "Order Manager",
    description: "Manage orders, update status, handle invoices and shipments",
    icon: ShoppingBag,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    value: "product_manager",
    label: "Product Manager",
    description: "Add, edit, and manage products, inventory, and pricing",
    icon: Package,
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  {
    value: "category_manager",
    label: "Category Manager",
    description: "Create and organize product categories and taxonomy",
    icon: FolderTree,
    color: "bg-teal-50 text-teal-700 border-teal-200",
    dot: "bg-teal-500",
  },
  {
    value: "blog_manager",
    label: "Blog Manager",
    description: "Write, edit, and publish blog posts and articles",
    icon: FileText,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  {
    value: "user_manager",
    label: "User Manager",
    description: "Manage user accounts, roles, and permissions",
    icon: Users,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  {
    value: "message_manager",
    label: "Message Manager",
    description: "Read, reply to (by email) and manage customer contact messages",
    icon: Mail,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dot: "bg-cyan-500",
  },
];

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isSelf?: boolean;
  canEditRole?: boolean;
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { data: session } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedRole, setSelectedRole] = useState("user");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setSelectedRole(data.role);
        } else {
          const body = await res.json().catch(() => ({}));
          setLoadError(res.status === 404 ? "User not found." : body.error || "Failed to load user.");
        }
      } catch {
        setLoadError("Failed to load user. Check your connection.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/users");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error || "Failed to update user");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    if (loadError) {
      return (
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
          <p className="text-red-600">{loadError}</p>
        </div>
      );
    }
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
        <p className="text-red-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
      <p className="text-gray-600 mb-8">Update user details</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            defaultValue={user.name || ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            name="email"
            type="email"
            defaultValue={user.email}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            name="password"
            type="password"
            minLength={MIN_PASSWORD_LENGTH}
            placeholder={`Leave blank to keep current password (min ${MIN_PASSWORD_LENGTH} characters)`}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Role *</label>
          {user.canEditRole ? (
            <input type="hidden" name="role" value={selectedRole} />
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2.5 mb-3">
              {user.isSelf
                ? "You can't change your own role. Ask another Admin."
                : "Only an Admin can change this account's role."}
            </p>
          )}
          <div className={`grid gap-2 ${user.canEditRole ? "" : "opacity-60 pointer-events-none"}`}>
            {roles
              .filter((r) => r.value !== "admin" || session?.user?.role === "admin" || user.role === "admin")
              .map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`flex items-start gap-3 w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? `${role.color} border-current ring-1 ring-current/20 shadow-sm`
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? role.color : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "" : "text-gray-900"
                        }`}
                      >
                        {role.label}
                      </span>
                      {isSelected && (
                        <span
                          className={`w-2 h-2 rounded-full ${role.dot} animate-pulse`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 leading-relaxed ${
                        isSelected ? "opacity-80" : "text-gray-500"
                      }`}
                    >
                      {role.description}
                    </p>
                  </div>
                  <div className="mt-1 flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-current"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className={`w-2.5 h-2.5 rounded-full ${role.dot}`} />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-700 text-white px-6 py-2 rounded-md font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
