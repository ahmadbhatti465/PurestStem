/**
 * Staff roles and which admin sections each one may use.
 *
 * Single source of truth for the API routes, the admin pages and the sidebar.
 * Safe to import from client components (no server-only code here).
 */

export const STAFF_ROLES = [
  "admin",
  "analytics_manager",
  "order_manager",
  "product_manager",
  "category_manager",
  "blog_manager",
  "user_manager",
  "message_manager",
] as const;

export const ALL_ROLES = ["user", ...STAFF_ROLES] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];
export type Role = (typeof ALL_ROLES)[number];

export type AdminSection =
  | "dashboard"
  | "analytics"
  | "orders"
  | "products"
  | "categories"
  | "blog"
  | "users"
  | "messages"
  | "uploads"
  | "linkSearch";

const SECTION_ROLES: Record<AdminSection, readonly string[]> = {
  dashboard: STAFF_ROLES,
  analytics: ["admin", "analytics_manager"],
  orders: ["admin", "order_manager"],
  products: ["admin", "product_manager"],
  categories: ["admin", "category_manager"],
  blog: ["admin", "blog_manager"],
  users: ["admin", "user_manager"],
  messages: ["admin", "message_manager"],
  // Shared tools used by more than one editor.
  uploads: ["admin", "product_manager", "blog_manager"],
  linkSearch: ["admin", "product_manager", "blog_manager"],
};

export function isValidRole(role: unknown): role is Role {
  return typeof role === "string" && (ALL_ROLES as readonly string[]).includes(role);
}

export function isStaffRole(role: unknown): role is StaffRole {
  return typeof role === "string" && (STAFF_ROLES as readonly string[]).includes(role);
}

export function canAccess(role: string | null | undefined, section: AdminSection): boolean {
  return !!role && SECTION_ROLES[section].includes(role);
}

/**
 * Whether `actorRole` may give a user `targetRole`, or edit/delete a user who
 * currently has `currentRole`. Only admins can create, promote or manage admins.
 */
export function canManageRole(actorRole: string, targetRole: string): boolean {
  if (actorRole === "admin") return true;
  if (actorRole === "user_manager") return targetRole !== "admin";
  return false;
}

export const ROLE_LABELS: Record<Role, string> = {
  user: "User",
  admin: "Admin",
  analytics_manager: "Analytics Manager",
  order_manager: "Order Manager",
  product_manager: "Product Manager",
  category_manager: "Category Manager",
  blog_manager: "Blog Manager",
  user_manager: "User Manager",
  message_manager: "Message Manager",
};

export const MIN_PASSWORD_LENGTH = 8;

/** Vercel rejects request bodies over 4.5 MB, so uploads are capped safely below it. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
