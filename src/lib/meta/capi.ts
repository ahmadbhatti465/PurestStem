import crypto from "crypto";
import { MetaCapiBatchRequest, MetaCapiEventPayload, MetaCustomData, MetaUserData } from "./types";

export const DEFAULT_PIXEL_ID = "3024519944563563";

export function getMetaPixelId(): string {
  return (
    process.env.META_PIXEL_ID ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID ||
    DEFAULT_PIXEL_ID
  );
}

export function getMetaAccessToken(): string | undefined {
  return process.env.META_CAPI_ACCESS_TOKEN || undefined;
}

export function getMetaTestEventCode(): string | undefined {
  return process.env.META_TEST_EVENT_CODE || undefined;
}

/**
 * SHA-256 hash helper complying with Meta CAPI requirements:
 * - Lowercase
 * - Trimmed of leading/trailing whitespace
 */
export function hashSha256(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Normalize and hash phone number:
 * Removes non-digits, prepends Pakistan country code 92 if starts with 03 or 3.
 */
export function hashPhone(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("03") && cleaned.length === 11) {
    cleaned = "92" + cleaned.slice(1);
  } else if (cleaned.startsWith("3") && cleaned.length === 10) {
    cleaned = "92" + cleaned;
  } else if (cleaned.startsWith("0092")) {
    cleaned = cleaned.slice(2);
  }
  return hashSha256(cleaned);
}

/**
 * Normalize and hash city:
 * Lowercase, remove spaces and punctuation
 */
export function hashCity(city: string): string {
  if (!city) return "";
  const cleaned = city.trim().toLowerCase().replace(/[^a-z]/g, "");
  return hashSha256(cleaned || city.trim().toLowerCase());
}

/**
 * Hash and sanitize Meta UserData object according to Meta CAPI specs
 */
export function normalizeUserData(userData: Partial<MetaUserData>): MetaUserData {
  const normalized: MetaUserData = {};

  if (userData.em) {
    const emails = Array.isArray(userData.em) ? userData.em : [userData.em];
    const hashed = emails.map((e) => (typeof e === "string" ? hashSha256(e) : "")).filter(Boolean);
    if (hashed.length > 0) normalized.em = hashed.length === 1 ? hashed[0] : hashed;
  }

  if (userData.ph) {
    const phones = Array.isArray(userData.ph) ? userData.ph : [userData.ph];
    const hashed = phones.map((p) => (typeof p === "string" ? hashPhone(p) : "")).filter(Boolean);
    if (hashed.length > 0) normalized.ph = hashed.length === 1 ? hashed[0] : hashed;
  }

  if (userData.fn) {
    const names = Array.isArray(userData.fn) ? userData.fn : [userData.fn];
    const hashed = names.map((n) => (typeof n === "string" ? hashSha256(n) : "")).filter(Boolean);
    if (hashed.length > 0) normalized.fn = hashed.length === 1 ? hashed[0] : hashed;
  }

  if (userData.ln) {
    const names = Array.isArray(userData.ln) ? userData.ln : [userData.ln];
    const hashed = names.map((n) => (typeof n === "string" ? hashSha256(n) : "")).filter(Boolean);
    if (hashed.length > 0) normalized.ln = hashed.length === 1 ? hashed[0] : hashed;
  }

  if (userData.ct) {
    const cities = Array.isArray(userData.ct) ? userData.ct : [userData.ct];
    const hashed = cities.map((c) => (typeof c === "string" ? hashCity(c) : "")).filter(Boolean);
    if (hashed.length > 0) normalized.ct = hashed.length === 1 ? hashed[0] : hashed;
  }

  if (userData.zp) {
    const zips = Array.isArray(userData.zp) ? userData.zp : [userData.zp];
    const hashed = zips.map((z) => (typeof z === "string" ? hashSha256(z) : "")).filter(Boolean);
    if (hashed.length > 0) normalized.zp = hashed.length === 1 ? hashed[0] : hashed;
  }

  if (userData.country) {
    const countries = Array.isArray(userData.country) ? userData.country : [userData.country];
    const hashed = countries.map((c) => (typeof c === "string" ? hashSha256(c) : "")).filter(Boolean);
    if (hashed.length > 0) normalized.country = hashed.length === 1 ? hashed[0] : hashed;
  }

  if (userData.external_id) {
    const ids = Array.isArray(userData.external_id) ? userData.external_id : [userData.external_id];
    const hashed = ids.map((id) => (typeof id === "string" ? hashSha256(id) : "")).filter(Boolean);
    if (hashed.length > 0) normalized.external_id = hashed.length === 1 ? hashed[0] : hashed;
  }

  // Non-hashed technical identifiers
  if (userData.client_ip_address) normalized.client_ip_address = userData.client_ip_address;
  if (userData.client_user_agent) normalized.client_user_agent = userData.client_user_agent;
  if (userData.fbp) normalized.fbp = userData.fbp;
  if (userData.fbc) normalized.fbc = userData.fbc;

  return normalized;
}

/**
 * Split full name into first and last name
 */
export function splitName(fullName?: string): { firstName?: string; lastName?: string } {
  if (!fullName) return {};
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Extract client IP from NextRequest / Request headers
 */
export function extractClientIp(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",");
    return ips[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return undefined;
}

/**
 * Send event(s) to Meta Conversions API
 */
export async function sendMetaCapiEvents(
  events: MetaCapiEventPayload[],
  testEventCodeOverride?: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const pixelId = getMetaPixelId();
  const accessToken = getMetaAccessToken();
  const testEventCode = testEventCodeOverride || getMetaTestEventCode();

  if (!accessToken) {
    // In dev or until token is configured, log info without throwing
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[Meta CAPI] Skipped sending ${events.length} event(s) because META_CAPI_ACCESS_TOKEN is not configured.`
      );
    }
    return { success: false, error: "META_CAPI_ACCESS_TOKEN not configured" };
  }

  const payload: MetaCapiBatchRequest = {
    data: events,
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(
    accessToken
  )}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Meta CAPI Error]", data);
      return { success: false, error: JSON.stringify(data), data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[Meta CAPI Network Error]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown network error",
    };
  }
}

/**
 * Helper to build and send a single CAPI event
 */
export async function sendSingleCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  userData: Partial<MetaUserData>;
  customData?: MetaCustomData;
}) {
  const normalizedUser = normalizeUserData(userData);
  const payload: MetaCapiEventPayload = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: "website",
    user_data: normalizedUser,
    custom_data: customData,
  };

  return await sendMetaCapiEvents([payload]);
}
