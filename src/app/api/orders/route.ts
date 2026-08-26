import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractClientIp, sendSingleCapiEvent, splitName } from "@/lib/meta/capi";

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
          create: (items as { productId: string; quantity: number; price: number }[]).map((item) => ({
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

    // Trigger Meta Conversions API (CAPI) server-side Purchase event
    try {
      const clientIp = extractClientIp(request.headers);
      const userAgent = request.headers.get("user-agent") || undefined;
      const fbpCookie = request.cookies.get("_fbp")?.value;
      const fbcCookie = request.cookies.get("_fbc")?.value;
      const { firstName, lastName } = splitName(name);

      await sendSingleCapiEvent({
        eventName: "Purchase",
        eventId: `purchase_${order.id}`,
        eventSourceUrl: request.headers.get("referer") || undefined,
        userData: {
          em: email,
          ph: phone,
          fn: firstName,
          ln: lastName,
          ct: city,
          zp: postalCode || undefined,
          country: "pk",
          client_ip_address: clientIp,
          client_user_agent: userAgent,
          fbp: fbpCookie,
          fbc: fbcCookie,
        },
        customData: {
          value: finalTotal,
          currency: "PKR",
          order_id: order.id,
          content_type: "product",
          content_ids: items.map((i: { productId: string }) => i.productId),
          contents: items.map((i: { productId: string; quantity: number; price: number }) => ({
            id: i.productId,
            quantity: i.quantity,
            item_price: i.price,
          })),
        },
      });
    } catch (capiError) {
      console.error("[Meta CAPI Purchase Error]", capiError);
      // Do not fail order creation if CAPI tracking has an issue
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
