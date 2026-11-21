import type { ReactNode } from "react";
import { getSectionSession } from "@/lib/admin-auth";
import type { AdminSection } from "@/lib/admin-roles";
import AccessDenied from "./access-denied";

/**
 * Section-level guard used by each admin section's layout. Server pages that
 * load data also check for themselves, because Next.js renders layouts and
 * pages in parallel.
 */
export default async function SectionGuard({
  section,
  children,
}: {
  section: AdminSection;
  children: ReactNode;
}) {
  const session = await getSectionSession(section);
  if (!session) return <AccessDenied />;
  return <>{children}</>;
}
