import { NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccess, type AdminSection } from "@/lib/admin-roles";

export type StaffSession = Session & { user: { id: string; role: string } };

type ApiAuthResult =
  | { ok: true; session: StaffSession }
  | { ok: false; response: NextResponse };

/**
 * Guards an admin API route. The role comes from the session, which the JWT
 * callback re-reads from the database, so demoted or deleted staff lose access.
 */
export async function requireApiSection(section: AdminSection): Promise<ApiAuthResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Please sign in." }, { status: 401 }) };
  }
  if (!canAccess(session.user.role, section)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "You don't have permission to do this." },
        { status: 403 }
      ),
    };
  }
  return { ok: true, session: session as StaffSession };
}

/** For server pages: returns the session if the viewer may use `section`, otherwise null. */
export async function getSectionSession(section: AdminSection): Promise<StaffSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !canAccess(session.user.role, section)) return null;
  return session as StaffSession;
}

/**
 * Records an admin action. Never throws: a failed audit write must not fail
 * the action that triggered it.
 */
export async function logAdminAction(
  session: StaffSession,
  action: string,
  entity: string,
  entityId?: string | null,
  details?: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email ?? null,
        action,
        entity,
        entityId: entityId ?? null,
        details: details ? JSON.stringify(details).slice(0, 4000) : null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

/** True when a Prisma error is a unique-constraint violation. */
export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

/** True when a Prisma error means the record to update/delete was not found. */
export function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2025"
  );
}

/** Reads a JSON body, returning null when it is missing or malformed. */
export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}
