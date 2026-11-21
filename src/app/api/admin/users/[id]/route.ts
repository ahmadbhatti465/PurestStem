import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { normalizeEmail } from "@/lib/auth";
import {
  requireApiSection,
  logAdminAction,
  isUniqueViolation,
  readJson,
} from "@/lib/admin-auth";
import { canManageRole, isValidRole, MIN_PASSWORD_LENGTH } from "@/lib/admin-roles";
import { EMAIL_PATTERN, str } from "@/lib/admin-input";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("users");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...user,
      isSelf: user.id === auth.session.user.id,
      canEditRole: canManageRole(auth.session.user.role, user.role) && user.id !== auth.session.user.id,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("users");
  if (!auth.ok) return auth.response;
  const { session } = auth;

  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  try {
    const { id } = await params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSelf = existing.id === session.user.id;
    if (!canManageRole(session.user.role, existing.role)) {
      return NextResponse.json({ error: "Only an Admin can edit Admin accounts." }, { status: 403 });
    }

    const data: { name?: string | null; email?: string; role?: string; password?: string } = {};

    if (body.name !== undefined) data.name = str(body.name, 200);

    if (body.email !== undefined) {
      const email = normalizeEmail(body.email);
      if (!email || !EMAIL_PATTERN.test(email)) {
        return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
      }
      data.email = email;
    }

    if (body.role !== undefined && body.role !== existing.role) {
      if (!isValidRole(body.role)) {
        return NextResponse.json({ error: "Unknown role." }, { status: 400 });
      }
      if (isSelf) {
        return NextResponse.json({ error: "You can't change your own role." }, { status: 403 });
      }
      if (!canManageRole(session.user.role, body.role)) {
        return NextResponse.json({ error: "Only an Admin can grant the Admin role." }, { status: 403 });
      }
      if (existing.role === "admin") {
        const admins = await prisma.user.count({ where: { role: "admin" } });
        if (admins <= 1) {
          return NextResponse.json(
            { error: "This is the last Admin account. Make someone else an Admin first." },
            { status: 409 }
          );
        }
      }
      data.role = body.role;
    }

    if (typeof body.password === "string" && body.password !== "") {
      if (body.password.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json(
          { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
          { status: 400 }
        );
      }
      data.password = await bcrypt.hash(body.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true },
    });

    await logAdminAction(session, "update", "user", id, {
      email: user.email,
      ...(data.role ? { roleFrom: existing.role, roleTo: data.role } : {}),
      passwordChanged: !!data.password,
    });
    return NextResponse.json(user);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "Another user already uses this email." }, { status: 409 });
    }
    console.error("Update user failed:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("users");
  if (!auth.ok) return auth.response;
  const { session } = auth;

  try {
    const { id } = await params;
    if (id === session.user.id) {
      return NextResponse.json({ error: "You can't delete your own account." }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { id }, select: { role: true, email: true } });
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!canManageRole(session.user.role, existing.role)) {
      return NextResponse.json({ error: "Only an Admin can delete Admin accounts." }, { status: 403 });
    }
    if (existing.role === "admin") {
      const admins = await prisma.user.count({ where: { role: "admin" } });
      if (admins <= 1) {
        return NextResponse.json({ error: "You can't delete the last Admin account." }, { status: 409 });
      }
    }

    await prisma.user.delete({ where: { id } });
    await logAdminAction(session, "delete", "user", id, { email: existing.email, role: existing.role });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user failed:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
