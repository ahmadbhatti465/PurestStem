import { NextRequest, NextResponse } from "next/server";
import { requireApiSection } from "@/lib/admin-auth";
import { generateOrderPDF, type DocumentType } from "@/lib/pdf/generator";

const LABELS: Record<DocumentType, string> = {
  invoice: "invoice",
  awb: "AWB",
  combined: "combined document",
};

/** Shared handler for the invoice / AWB / combined PDF routes. */
export async function orderDocumentResponse(
  req: NextRequest,
  params: Promise<{ id: string }>,
  type: DocumentType
) {
  const auth = await requireApiSection("orders");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const isPreview = req.nextUrl.searchParams.get("preview") === "true";

    // Previews don't count as "generated"; only real downloads stamp the order.
    const pdfResult = await generateOrderPDF(id, type, { markGenerated: !isPreview });
    if (!pdfResult) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return new Response(new Uint8Array(pdfResult.buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${isPreview ? "inline" : "attachment"}; filename="${pdfResult.filename}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error(`[${type} generation error]`, error);
    return NextResponse.json(
      { error: `Unable to generate ${LABELS[type]}. Please try again.` },
      { status: 500 }
    );
  }
}
