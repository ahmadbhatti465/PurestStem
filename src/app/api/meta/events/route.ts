import { NextRequest, NextResponse } from "next/server";
import { extractClientIp, sendSingleCapiEvent } from "@/lib/meta/capi";
import { MetaCustomData, MetaUserData } from "@/lib/meta/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventName,
      eventId,
      eventSourceUrl,
      customData,
      userData = {},
    }: {
      eventName: string;
      eventId?: string;
      eventSourceUrl?: string;
      customData?: MetaCustomData;
      userData?: Partial<MetaUserData>;
    } = body;

    if (!eventName) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }

    // Security: Disallow client-side proxying of Purchase events (Purchase is exclusively dispatched server-side in /api/orders)
    const ALLOWED_CLIENT_EVENTS = ["ViewContent", "AddToCart", "InitiateCheckout", "AddPaymentInfo", "PageView"];
    if (!ALLOWED_CLIENT_EVENTS.includes(eventName)) {
      return NextResponse.json(
        { error: `Event '${eventName}' cannot be proxied through this endpoint` },
        { status: 403 }
      );
    }

    // Extract technical request attributes
    const clientIp = extractClientIp(request.headers);
    const userAgent = request.headers.get("user-agent") || undefined;
    const fbpCookie = request.cookies.get("_fbp")?.value;
    const fbcCookie = request.cookies.get("_fbc")?.value;

    const enrichedUserData: Partial<MetaUserData> = {
      ...userData,
      client_ip_address: clientIp || userData.client_ip_address,
      client_user_agent: userAgent || userData.client_user_agent,
      fbp: fbpCookie || userData.fbp,
      fbc: fbcCookie || userData.fbc,
    };

    const result = await sendSingleCapiEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || request.headers.get("referer") || undefined,
      userData: enrichedUserData,
      customData,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("[Meta CAPI Route Error]", error);
    return NextResponse.json(
      { error: "Failed to process Meta CAPI event" },
      { status: 500 }
    );
  }
}
