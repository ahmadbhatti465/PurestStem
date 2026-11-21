import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { extractClientIp, sendSingleCapiEvent, splitName } from "@/lib/meta/capi";
import { shippingFor } from "@/lib/shipping";
import { refreshStorefront } from "@/lib/storefront-cache";
import { liveProductWhere } from "@/lib/visibility";

const orderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(190),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(5).max(500),
  city: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(1000).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1)
    .max(50),
});

class OrderRejectedError extends Error {}

export async function POST(request: NextRequest) {
  let input: z.infer<typeof orderSchema>;
  try {
    input = orderSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Please check your details and try again." },
      { status: 400 }
    );
  }

  const { items, name, email, phone, address, city, postalCode, notes } = input;

  // The same product may appear twice; treat it as one line.
  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  try {
    const order = await prisma.$transaction(
      async (tx) => {
        // Prices always come from the database, never from the browser.
        const products = await tx.product.findMany({
          where: { id: { in: [...quantities.keys()] }, ...liveProductWhere() },
          select: { id: true, name: true, price: true, salePrice: true, sku: true, weight: true },
        });
        const productsById = new Map(products.map((product) => [product.id, product]));

        const lines = [...quantities].map(([productId, quantity]) => {
          const product = productsById.get(productId);
          if (!product) {
            throw new OrderRejectedError(
              "An item in your cart is no longer available. Please remove it and try again."
            );
          }
          return { product, productId, quantity, price: product.salePrice || product.price };
        });

        for (const line of lines) {
          // Conditional update, so two simultaneous orders cannot oversell.
          const { count } = await tx.product.updateMany({
            where: { id: line.productId, stock: { gte: line.quantity } },
            data: { stock: { decrement: line.quantity } },
          });
          if (count === 0) {
            throw new OrderRejectedError(
              `Sorry, we don't have enough stock of ${line.product.name}. Please reduce the quantity.`
            );
          }
        }

        const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
        const shippingCost = shippingFor(subtotal);

        return tx.order.create({
          data: {
            name,
            email,
            phone,
            address,
            city,
            postalCode: postalCode || null,
            notes: notes || null,
            total: subtotal + shippingCost,
            shippingCost,
            paymentMethod: "cod",
            items: {
              create: lines.map(({ product, productId, quantity, price }) => ({
                productId,
                quantity,
                price,
                productName: product.name,
                productSku: product.sku,
                productWeight: product.weight,
              })),
            },
          },
          include: { items: true },
        });
      },
      { timeout: 15000 }
    );

    refreshStorefront();

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
          value: order.total,
          currency: "PKR",
          order_id: order.id,
          content_type: "product",
          content_ids: order.items.map((item) => item.productId as string),
          contents: order.items.map((item) => ({
            id: item.productId as string,
            quantity: item.quantity,
            item_price: item.price,
          })),
        },
      });
    } catch (capiError) {
      console.error("[Meta CAPI Purchase Error]", capiError);
      // Do not fail order creation if CAPI tracking has an issue
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof OrderRejectedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
