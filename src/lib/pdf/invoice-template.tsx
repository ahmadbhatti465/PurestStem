import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { BUSINESS_INFO } from "@/lib/business-config";

export interface PDFOrderItem {
  id: string;
  name: string;
  sku?: string | null;
  weight?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PDFOrderData {
  orderId: string;
  shortId: string;
  orderNumberFormatted: string;
  invoiceNumber: string;
  createdAt: string | Date;
  formattedDate: string;
  formattedTime?: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  isCOD: boolean;
  total: number;
  subtotal: number;
  shippingCost: number;
  codAmountToCollect: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode?: string | null;
  customerCountry: string;
  notes?: string | null;
  courier?: string | null;
  awbNumber?: string | null;
  trackingNumber?: string | null;
  shippingMethod: string;
  items: PDFOrderItem[];
  totalQuantity: number;
  logoDataUriOrPath: string;
  barcodeDataUri?: string;
  qrCodeDataUri?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1f2937",
    backgroundColor: "#ffffff",
    lineHeight: 1.4,
  },
  // Top header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "#1a4a2e",
    marginBottom: 16,
  },
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "55%",
  },
  logo: {
    width: 110,
    height: "auto",
    objectFit: "contain",
    marginRight: 12,
  },
  brandDetails: {
    flexDirection: "column",
  },
  brandTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#132e1f",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 7.5,
    color: "#4b5563",
    marginTop: 2,
    marginBottom: 4,
  },
  brandContact: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.3,
  },
  invoiceMetaSection: {
    alignItems: "flex-end",
    minWidth: "38%",
  },
  invoiceTitleBadge: {
    backgroundColor: "#1a4a2e",
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: "center",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2.5,
  },
  metaLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#4b5563",
    marginRight: 6,
    textAlign: "right",
  },
  metaValue: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: "#111827",
    textAlign: "right",
  },
  metaValueHighlight: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1a4a2e",
    textAlign: "right",
  },
  // Address & Order info grid
  partiesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#f9faf5",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
  },
  partyColumn: {
    width: "48%",
  },
  partyHeading: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1a4a2e",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 3,
    marginBottom: 6,
  },
  partyName: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  partyText: {
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.35,
  },
  partyPhone: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a4a2e",
    marginTop: 4,
  },
  // Items Table
  table: {
    width: "100%",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#132e1f",
    color: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    fontSize: 8.5,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#fafcf8",
  },
  colNo: { width: "6%", textAlign: "center" },
  colDesc: { width: "46%", paddingRight: 8 },
  colSku: { width: "16%", textAlign: "center" },
  colQty: { width: "10%", textAlign: "center" },
  colUnitPrice: { width: "11%", textAlign: "right" },
  colTotal: { width: "11%", textAlign: "right" },
  itemName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: "#111827",
  },
  itemWeight: {
    fontSize: 7.5,
    color: "#6b7280",
    marginTop: 1,
  },
  // Bottom section: Notes / Payment + Totals
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  leftNotesBox: {
    width: "52%",
    paddingRight: 10,
  },
  paymentInfoCard: {
    backgroundColor: "#f9faf5",
    borderWidth: 1,
    borderColor: "#c8e8a8",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  paymentMethodBadge: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1a4a2e",
    marginBottom: 2,
  },
  codAlertBox: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 4,
    padding: 8,
  },
  codAlertTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    marginBottom: 2,
  },
  codAlertText: {
    fontSize: 8,
    color: "#78350f",
  },
  totalsBox: {
    width: "44%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4.5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  totalLabel: {
    fontSize: 8.5,
    color: "#4b5563",
  },
  totalValue: {
    fontSize: 8.5,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 8,
    backgroundColor: "#132e1f",
  },
  grandTotalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  grandTotalValue: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#c8e8a8",
  },
  // Footer
  footerContainer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7.5,
    color: "#6b7280",
  },
  pageNumber: {
    fontSize: 7.5,
    color: "#6b7280",
    fontFamily: "Helvetica",
  },
});

export function InvoiceDocument({ order }: { order: PDFOrderData }) {
  const currency = BUSINESS_INFO.currencySymbol;

  return (
    <Document title={`PurestStem-Invoice-${order.shortId}`} author={BUSINESS_INFO.brandName}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.brandSection}>
            {order.logoDataUriOrPath && (
              <Image style={styles.logo} src={order.logoDataUriOrPath} />
            )}
            <View style={styles.brandDetails}>
              <Text style={styles.brandTitle}>{BUSINESS_INFO.brandName}</Text>
              <Text style={styles.brandTagline}>{BUSINESS_INFO.tagline}</Text>
              <Text style={styles.brandContact}>{BUSINESS_INFO.fullAddress}</Text>
              <Text style={styles.brandContact}>Phone: {BUSINESS_INFO.phone}</Text>
              <Text style={styles.brandContact}>Web: {BUSINESS_INFO.websiteUrl}</Text>
            </View>
          </View>

          <View style={styles.invoiceMetaSection}>
            <Text style={styles.invoiceTitleBadge}>TAX INVOICE</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice No:</Text>
              <Text style={styles.metaValueHighlight}>{order.invoiceNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Order No:</Text>
              <Text style={styles.metaValue}>{order.orderNumberFormatted}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice Date:</Text>
              <Text style={styles.metaValue}>{order.formattedDate}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Payment Status:</Text>
              <Text style={styles.metaValueHighlight}>
                {order.isCOD ? "Cash on Delivery (Pending)" : order.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* FROM & TO Cards */}
        <View style={styles.partiesGrid}>
          <View style={styles.partyColumn}>
            <Text style={styles.partyHeading}>Billed & Shipped From</Text>
            <Text style={styles.partyName}>{BUSINESS_INFO.brandName}</Text>
            <Text style={styles.partyText}>{BUSINESS_INFO.addressLine1}</Text>
            <Text style={styles.partyText}>{BUSINESS_INFO.city}, {BUSINESS_INFO.country}</Text>
            <Text style={styles.partyPhone}>Helpline: {BUSINESS_INFO.phone}</Text>
            <Text style={styles.partyText}>Website: {BUSINESS_INFO.websiteUrl}</Text>
          </View>

          <View style={styles.partyColumn}>
            <Text style={styles.partyHeading}>Ship & Bill To</Text>
            <Text style={styles.partyName}>{order.customerName}</Text>
            <Text style={styles.partyText}>{order.customerAddress}</Text>
            <Text style={styles.partyText}>
              {order.customerCity}
              {order.customerPostalCode ? ` - ${order.customerPostalCode}` : ""}, {order.customerCountry}
            </Text>
            <Text style={styles.partyPhone}>Phone: {order.customerPhone}</Text>
          </View>
        </View>

        {/* Order Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>#</Text>
            <Text style={styles.colDesc}>PRODUCT</Text>
            <Text style={styles.colSku}>SKU</Text>
            <Text style={styles.colQty}>QTY</Text>
            <Text style={styles.colUnitPrice}>UNIT PRICE</Text>
            <Text style={styles.colTotal}>TOTAL</Text>
          </View>

          {order.items.map((item, idx) => (
            <View
              key={item.id || idx}
              style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowEven : {}]}
              wrap={false}
            >
              <Text style={styles.colNo}>{idx + 1}</Text>
              <View style={styles.colDesc}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.weight && <Text style={styles.itemWeight}>{item.weight}</Text>}
              </View>
              <Text style={styles.colSku}>{item.sku || "—"}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colUnitPrice}>
                {currency} {item.unitPrice.toLocaleString()}
              </Text>
              <Text style={styles.colTotal}>
                {currency} {item.subtotal.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom Section: Notes / COD Details + Totals Summary */}
        <View style={styles.bottomSection}>
          <View style={styles.leftNotesBox}>
            <View style={styles.paymentInfoCard}>
              <Text style={styles.paymentMethodBadge}>
                Payment Method: {order.isCOD ? "Cash on Delivery (COD)" : order.paymentMethod.toUpperCase()}
              </Text>
              <Text style={styles.partyText}>
                Shipping: {order.shippingMethod}
                {order.courier ? ` via ${order.courier}` : ""}
              </Text>
              {order.trackingNumber && (
                <Text style={styles.partyText}>
                  Tracking / AWB: {order.trackingNumber}
                </Text>
              )}
            </View>

            {order.isCOD && (
              <View style={styles.codAlertBox}>
                <Text style={styles.codAlertTitle}>
                  CASH ON DELIVERY — COLLECT: {currency} {order.total.toLocaleString()}
                </Text>
                <Text style={styles.codAlertText}>
                  Please pay exact amount in Pakistani Rupees to the delivery rider upon receiving this package.
                </Text>
              </View>
            )}

            {order.notes && (
              <View style={{ marginTop: 6 }}>
                <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#4b5563" }}>
                  Customer Note:
                </Text>
                <Text style={{ fontSize: 7.5, color: "#6b7280" }}>{order.notes}</Text>
              </View>
            )}
          </View>

          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Items Subtotal</Text>
              <Text style={styles.totalValue}>
                {currency} {order.subtotal.toLocaleString()}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping Charges</Text>
              <Text style={styles.totalValue}>
                {order.shippingCost === 0 ? "FREE" : `${currency} ${order.shippingCost.toLocaleString()}`}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
              <Text style={styles.grandTotalValue}>
                {currency} {order.total.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer} fixed>
          <Text style={styles.footerText}>
            Thank you for choosing PurestStem • {BUSINESS_INFO.websiteUrl} • Helpline: {BUSINESS_INFO.phone}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
export default InvoiceDocument;
