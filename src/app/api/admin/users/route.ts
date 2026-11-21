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

export async function POST(req: NextRequest) {
  const auth = await requireApiSection("users");
  if (!auth.ok) return auth.response;
  const { session } = auth;

  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role ?? "user";

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }
  if (!isValidRole(role)) {
    return NextResponse.json({ error: "Unknown role." }, { status: 400 });
  }
  if (!canManageRole(session.user.role, role)) {
    return NextResponse.json(
      { error: "Only an Admin can create Admin accounts." },
      { status: 403 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: str(body.name, 200),
        password: await bcrypt.hash(password, 10),
        role,
      },
      select: { id: true, email: true, name: true, role: true },
    });
    await logAdminAction(session, "create", "user", user.id, { email, role });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    console.error("Create user failed:", error);
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}
