import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, name, email, phone, address, city, postalCode, notes, total } = body;

    if (!items?.length || !name || !email || !phone || !address || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shippingCost = total >= 5000 ? 0 : 190;
    const finalTotal = total + shippingCost;

    const order = await prisma.order.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        notes,
        total: finalTotal,
        shippingCost,
        paymentMethod: "cod",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
