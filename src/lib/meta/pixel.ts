import { MetaCustomData, MetaUserData } from "./types";

declare global {
  interface Window {
    fbq?: (
      action: "track" | "trackCustom" | "init",
      eventName: string,
      customData?: MetaCustomData,
      options?: { eventID?: string }
    ) => void;
    _fbq?: unknown;
  }
}

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "3024519944563563";

export function generateEventId(prefix = "evt"): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Get cookie value by name in browser
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

/**
 * Get _fbp and _fbc cookies
 */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  return {
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
  };
}

/**
 * Call fbq('track', ...) safely in browser
 */
export function fbqTrack(
  eventName: string,
  data?: MetaCustomData,
  eventId?: string
) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("track", eventName, data, { eventID: eventId });
    } else {
      window.fbq("track", eventName, data);
    }
  }
}

/**
 * Proxy event to server-side CAPI endpoint for unified server-side tracking
 */
export async function proxyToCapi({
  eventName,
  eventId,
  customData,
  userData = {},
}: {
  eventName: string;
  eventId: string;
  customData?: MetaCustomData;
  userData?: Partial<MetaUserData>;
}) {
  if (typeof window === "undefined") return;

  try {
    const metaCookies = getMetaCookies();
    const mergedUserData: Partial<MetaUserData> = {
      ...metaCookies,
      ...userData,
    };

    await fetch("/api/meta/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        customData,
        userData: mergedUserData,
      }),
      // Keep alive so it completes even if navigation occurs
      keepalive: true,
    });
  } catch (err) {
    // Fail silently in browser to avoid disrupting user experience
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Meta CAPI Proxy Failed]", err);
    }
  }
}

/**
 * 1. Track PageView
 */
export function trackPageView(url?: string) {
  if (typeof window === "undefined") return;
  fbqTrack("PageView");
}

/**
 * 2. Track ViewContent (Product detail page view)
 */
export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  const eventId = generateEventId(`vc_${product.id}`);
  const customData: MetaCustomData = {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    content_type: "product",
    value: product.price,
    currency: "PKR",
  };

  // 1. Browser Pixel
  fbqTrack("ViewContent", customData, eventId);

  // 2. Server CAPI (Proxied)
  proxyToCapi({
    eventName: "ViewContent",
    eventId,
    customData,
  });

  return eventId;
}

/**
 * 3. Track AddToCart (Product added to cart)
 */
export function trackAddToCart(item: {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}) {
  const eventId = generateEventId(`atc_${item.productId}`);
  const customData: MetaCustomData = {
    content_ids: [item.productId],
    content_name: item.name,
    content_category: item.category,
    content_type: "product",
    value: item.price * item.quantity,
    currency: "PKR",
    contents: [
      {
        id: item.productId,
        quantity: item.quantity,
        item_price: item.price,
        title: item.name,
      },
    ],
  };

  // 1. Browser Pixel
  fbqTrack("AddToCart", customData, eventId);

  // 2. Server CAPI (Proxied)
  proxyToCapi({
    eventName: "AddToCart",
    eventId,
    customData,
  });

  return eventId;
}

/**
 * 4. Track InitiateCheckout
 */
export function trackInitiateCheckout(
  items: Array<{ productId: string; name?: string; price: number; quantity: number }>,
  total: number
) {
  const eventId = generateEventId("ic");
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  const customData: MetaCustomData = {
    content_ids: items.map((i) => i.productId),
    content_type: "product",
    num_items: totalQuantity,
    value: total,
    currency: "PKR",
    contents: items.map((i) => ({
      id: i.productId,
      quantity: i.quantity,
      item_price: i.price,
      title: i.name,
    })),
  };

  // 1. Browser Pixel
  fbqTrack("InitiateCheckout", customData, eventId);

  // 2. Server CAPI (Proxied)
  proxyToCapi({
    eventName: "InitiateCheckout",
    eventId,
    customData,
  });

  return eventId;
}

/**
 * 5. Track AddPaymentInfo (if applicable)
 */
export function trackAddPaymentInfo(value: number, currency = "PKR") {
  const eventId = generateEventId("api");
  const customData: MetaCustomData = {
    value,
    currency,
  };

  fbqTrack("AddPaymentInfo", customData, eventId);

  proxyToCapi({
    eventName: "AddPaymentInfo",
    eventId,
    customData,
  });

  return eventId;
}

/**
 * 6. Track Purchase (Browser side deduplicated with server CAPI)
 */
export function trackPurchase(
  order: {
    id: string;
    total: number;
    items?: Array<{
      productId?: string | null;
      product?: { id: string; name?: string; price?: number };
      quantity: number;
      price: number;
      name?: string;
    }>;
  },
  eventIdOverride?: string
) {
  const eventId = eventIdOverride || `purchase_${order.id}`;

  const customData: MetaCustomData = {
    content_ids: order.items
      ? order.items.map((i) => i.productId || i.product?.id || "").filter(Boolean)
      : [],
    content_type: "product",
    value: order.total,
    currency: "PKR",
    order_id: order.id,
    contents: order.items
      ? order.items.map((i) => ({
          id: i.productId || i.product?.id || "",
          quantity: i.quantity,
          item_price: i.price,
          title: i.name || i.product?.name,
        }))
      : undefined,
  };

  fbqTrack("Purchase", customData, eventId);
  return eventId;
}
