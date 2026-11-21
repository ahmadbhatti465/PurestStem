import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { requireApiSection, logAdminAction, readJson } from "@/lib/admin-auth";
import { isOrderStatus } from "@/lib/order-status";

class StockError extends Error {}

/**
 * Updates an order's status. Cancelling returns the items to stock;
 * moving a cancelled order back to an active status takes them out again
 * (and is refused if there is no longer enough stock).
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSection("orders");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  const status = body?.status;
  if (!isOrderStatus(status)) {
    return NextResponse.json({ error: "Unknown order status." }, { status: 400 });
  }

  try {
    const { id } = await params;
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
        include: { items: { select: { productId: true, quantity: true, productName: true } } },
      });
      if (!existing) return null;
      if (existing.status === status) return { order: existing, previous: existing.status, stockChanged: false };

      const cancelling = status === "cancelled" && existing.status !== "cancelled";
      const reviving = existing.status === "cancelled" && status !== "cancelled";

      for (const item of existing.items) {
        if (!item.productId) continue; // product was deleted; nothing to restock
        if (cancelling) {
          await tx.product.updateMany({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        } else if (reviving) {
          const { count } = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (count === 0) {
            throw new StockError(
              `Not enough stock of ${item.productName ?? "an item"} to reopen this order.`
            );
          }
        }
      }

      const order = await tx.order.update({ where: { id }, data: { status } });
      return { order, previous: existing.status, stockChanged: cancelling || reviving };
    });

    if (!result) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (result.stockChanged) refreshStorefront();
    if (result.previous !== status) {
      await logAdminAction(auth.session, "status", "order", id, {
        from: result.previous,
        to: status,
        stockChanged: result.stockChanged,
      });
    }
    return NextResponse.json(result.order);
  } catch (error) {
    if (error instanceof StockError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Update order failed:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
