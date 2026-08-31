import fs from "fs";
import path from "path";
import React from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { renderToBuffer, Font } from "@react-pdf/renderer";

// Prevent dynamic hyphenation submodule resolution in modern Node runtimes
Font.registerHyphenationCallback((word) => [word]);
import { prisma } from "@/lib/db";
import { generateBarcodeDataUrl, generateQrCodeDataUrl } from "./barcode-helper";
import { InvoiceDocument, type PDFOrderData, type PDFOrderItem } from "./invoice-template";
import { AWBDocument } from "./awb-template";
import { CombinedDocument } from "./combined-template";
import { BUSINESS_INFO } from "@/lib/business-config";

/**
 * Loads the brand logo as a base64 data URL for fast and reliable PDF embedding.
 */
function getLogoBase64(): string {
  try {
    const logoPath = path.join(process.cwd(), "public", "pureststem_logo.png");
    if (fs.existsSync(logoPath)) {
      const fileBuffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${fileBuffer.toString("base64")}`;
    }
  } catch (err) {
    console.error("[PDF Generator] Could not read logo file:", err);
  }
  return "";
}

/**
 * Formats a Date object into human readable Pakistan date.
 */
function formatOrderDate(d: Date) {
  return d.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Prepares complete, validated PDFOrderData for an order by ID.
 * Persists deterministic invoiceNumber if it does not yet exist.
 */
export async function prepareOrderPDFData(orderId: string): Promise<PDFOrderData | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) return null;

  const shortId = order.id.slice(-6).toUpperCase();
  const year = new Date(order.createdAt).getFullYear();

  // Ensure deterministic invoice number is persisted
  let invoiceNumber = order.invoiceNumber;
  if (!invoiceNumber) {
    invoiceNumber = `INV-${year}-${shortId}`;
    try {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          invoiceNumber,
          invoiceGeneratedAt: order.invoiceGeneratedAt || new Date(),
        },
      });
    } catch (e) {
      console.warn("[PDF Generator] Could not persist invoiceNumber (may already exist):", e);
    }
  }

  const shippingCost = order.shippingCost ?? (order.total >= 5000 ? 0 : 190);
  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const isCOD = order.paymentMethod.toLowerCase() === "cod";

  const pdfItems: PDFOrderItem[] = order.items.map((item) => ({
    id: item.id,
    name: item.product?.name || "PurestStem Herbal Product",
    sku: item.product?.sku || null,
    weight: item.product?.weight || null,
    quantity: item.quantity,
    unitPrice: item.price,
    subtotal: item.price * item.quantity,
  }));

  const logoBase64 = getLogoBase64();
  const barcodeValue = order.awbNumber || order.trackingNumber || shortId;
  const barcodeDataUri = await generateBarcodeDataUrl(barcodeValue);

  const qrPayload = `${BUSINESS_INFO.websiteUrl}/orders?ref=${shortId}`;
  const qrCodeDataUri = await generateQrCodeDataUrl(qrPayload);

  return {
    orderId: order.id,
    shortId,
    orderNumberFormatted: `#${shortId}`,
    invoiceNumber,
    createdAt: order.createdAt,
    formattedDate: formatOrderDate(order.createdAt),
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: isCOD ? (order.status === "completed" ? "Paid (COD Collected)" : "Cash on Delivery") : "Paid",
    isCOD,
    total: order.total,
    subtotal: itemsSubtotal,
    shippingCost,
    codAmountToCollect: isCOD ? order.total : 0,
    customerName: order.name,
    customerPhone: order.phone,
    customerAddress: order.address,
    customerCity: order.city,
    customerPostalCode: order.postalCode,
    customerCountry: "Pakistan",
    notes: order.notes,
    courier: order.courier,
    awbNumber: order.awbNumber,
    trackingNumber: order.trackingNumber,
    shippingMethod: shippingCost === 0 ? "Free Standard Shipping" : "Standard Shipping",
    items: pdfItems,
    totalQuantity,
    logoDataUriOrPath: logoBase64,
    barcodeDataUri,
    qrCodeDataUri,
  };
}

export type DocumentType = "invoice" | "awb" | "combined";

/**
 * Generates the requested PDF Document as a binary Buffer.
 */
export async function generateOrderPDF(
  orderId: string,
  type: DocumentType = "invoice"
): Promise<{ buffer: Buffer; filename: string } | null> {
  const data = await prepareOrderPDFData(orderId);
  if (!data) return null;

  let docElement: React.ReactElement<DocumentProps>;
  let filename: string;

  switch (type) {
    case "awb":
      docElement = React.createElement(AWBDocument, { order: data }) as unknown as React.ReactElement<DocumentProps>;
      filename = `PurestStem-AWB-${data.shortId}.pdf`;
      break;
    case "combined":
      docElement = React.createElement(CombinedDocument, { order: data }) as unknown as React.ReactElement<DocumentProps>;
      filename = `PurestStem-Order-${data.shortId}-Documents.pdf`;
      break;
    case "invoice":
    default:
      docElement = React.createElement(InvoiceDocument, { order: data }) as unknown as React.ReactElement<DocumentProps>;
      filename = `PurestStem-Invoice-${data.shortId}.pdf`;
      break;
  }

  // Update generated timestamp
  if (type === "awb" || type === "combined") {
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { awbGeneratedAt: new Date() },
      });
    } catch {}
  }

  // Render to PDF buffer
  const buffer = await renderToBuffer(docElement);
  return { buffer, filename };
}
