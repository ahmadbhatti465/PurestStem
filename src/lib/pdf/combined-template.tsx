import React from "react";
import { Document } from "@react-pdf/renderer";
import { BUSINESS_INFO } from "@/lib/business-config";
import type { PDFOrderData } from "./invoice-template";
import { InvoiceDocument } from "./invoice-template";
import { AWBDocument } from "./awb-template";

export function CombinedDocument({ order }: { order: PDFOrderData }) {
  // Extract pages from Invoice and AWB documents
  return (
    <Document title={`PurestStem-Order-${order.shortId}-Documents`} author={BUSINESS_INFO.brandName}>
      {/* Page 1: Invoice */}
      {InvoiceDocument({ order }).props.children}
      {/* Page 2: AWB */}
      {AWBDocument({ order }).props.children}
    </Document>
  );
}

export default CombinedDocument;
