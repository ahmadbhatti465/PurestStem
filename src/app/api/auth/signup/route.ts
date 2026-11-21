import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { normalizeEmail } from "@/lib/auth";
import { isUniqueViolation, readJson } from "@/lib/admin-auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/admin-roles";
import { EMAIL_PATTERN, str } from "@/lib/admin-input";

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !EMAIL_PATTERN.test(email) || !password) {
    return NextResponse.json({ error: "A valid email and password are required" }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: str(body?.name, 200),
        password: await bcrypt.hash(password, 10),
        role: "user",
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      { status: 201 }
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
