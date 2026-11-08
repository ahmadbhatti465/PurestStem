export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_COST = 190;

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}
