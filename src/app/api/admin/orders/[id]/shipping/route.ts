import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { courier, awbNumber, trackingNumber } = body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        courier: courier !== undefined ? (courier?.trim() || null) : undefined,
        awbNumber: awbNumber !== undefined ? (awbNumber?.trim() || null) : undefined,
        trackingNumber: trackingNumber !== undefined ? (trackingNumber?.trim() || null) : undefined,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[Update Shipping Info Error]", error);
    return NextResponse.json({ error: "Failed to update shipping information" }, { status: 500 });
  }
}
