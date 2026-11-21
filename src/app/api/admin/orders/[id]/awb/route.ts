import { NextRequest } from "next/server";
import { orderDocumentResponse } from "@/lib/pdf/document-response";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return orderDocumentResponse(req, params, "awb");
}
