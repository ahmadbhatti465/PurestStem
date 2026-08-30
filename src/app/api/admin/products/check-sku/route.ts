import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const sku = (searchParams.get("sku") || "").trim();
  const excludeId = searchParams.get("excludeId");

  if (!sku) {
    return NextResponse.json({ available: true });
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { sku },
      select: { id: true, name: true },
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return NextResponse.json({ available: true, sku });
    }

    return NextResponse.json({
      available: false,
      sku,
      message: `A product with SKU "${sku}" already exists ("${existing.name}").`,
    });
  } catch (error) {
    console.error("Error checking SKU:", error);
    return NextResponse.json({ error: "Failed to check SKU" }, { status: 500 });
  }
}
