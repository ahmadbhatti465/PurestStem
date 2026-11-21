import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSection, logAdminAction, isNotFound, readJson } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireApiSection("messages");
  if (!auth.ok) return auth.response;

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireApiSection("messages");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  if (typeof body?.id !== "string" || typeof body.read !== "boolean") {
    return NextResponse.json({ error: "id and read (boolean) are required." }, { status: 400 });
  }

  try {
    const msg = await prisma.contactMessage.update({
      where: { id: body.id },
      data: { read: body.read },
    });
    return NextResponse.json(msg);
  } catch (error) {
    if (isNotFound(error)) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireApiSection("messages");
  if (!auth.ok) return auth.response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await prisma.contactMessage.delete({ where: { id } });
    await logAdminAction(auth.session, "delete", "message", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFound(error)) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
