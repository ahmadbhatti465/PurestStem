/** Order statuses, shared by the orders API and the admin UI. */
export const ORDER_STATUSES = ["pending", "processing", "shipped", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

/** Orders that count toward revenue (cancelled orders never do). */
export const REVENUE_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "completed"];
