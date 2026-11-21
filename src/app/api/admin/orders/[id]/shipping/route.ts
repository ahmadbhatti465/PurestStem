import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSection, logAdminAction, isNotFound, readJson } from "@/lib/admin-auth";
import { str } from "@/lib/admin-input";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSection("orders");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const field = (key: string) => (body[key] !== undefined ? str(body[key], 120) : undefined);

  try {
    const { id } = await params;
    const order = await prisma.order.update({
      where: { id },
      data: {
        courier: field("courier"),
        awbNumber: field("awbNumber"),
        trackingNumber: field("trackingNumber"),
      },
    });
    await logAdminAction(auth.session, "shipping", "order", id, {
      courier: order.courier,
      awbNumber: order.awbNumber,
      trackingNumber: order.trackingNumber,
    });
    return NextResponse.json(order);
  } catch (error) {
    if (isNotFound(error)) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    console.error("[Update Shipping Info Error]", error);
    return NextResponse.json({ error: "Failed to update shipping information" }, { status: 500 });
  }
}
