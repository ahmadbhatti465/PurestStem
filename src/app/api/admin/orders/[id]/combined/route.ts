import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateOrderPDF } from "@/lib/pdf/generator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const isPreview = req.nextUrl.searchParams.get("preview") === "true";

    const pdfResult = await generateOrderPDF(id, "combined");
    if (!pdfResult) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const dispositionType = isPreview ? "inline" : "attachment";

    return new Response(new Uint8Array(pdfResult.buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${pdfResult.filename}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[Combined Document Generation Error]", error);
    return NextResponse.json(
      { error: "Unable to generate combined document. Please try again." },
      { status: 500 }
    );
  }
}
