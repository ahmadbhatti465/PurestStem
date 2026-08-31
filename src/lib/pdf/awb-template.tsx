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
import type { PDFOrderData } from "./invoice-template";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#111827",
    backgroundColor: "#ffffff",
    lineHeight: 1.35,
  },
  labelContainer: {
    borderWidth: 2,
    borderColor: "#132e1f",
    borderRadius: 6,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  // Top Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#132e1f",
    paddingBottom: 12,
    marginBottom: 12,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  logo: {
    width: 100,
    height: "auto",
    objectFit: "contain",
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#132e1f",
  },
  docBadge: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    backgroundColor: "#132e1f",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  orderRefSection: {
    alignItems: "flex-end",
    width: "48%",
  },
  orderNumberText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#132e1f",
    marginTop: 3,
  },
  dateText: {
    fontSize: 8,
    color: "#4b5563",
    marginTop: 1,
  },
  // Barcode & QR Code Section
  barcodeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9faf5",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  barcodeWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 12,
  },
  barcodeImage: {
    width: 230,
    height: 44,
    objectFit: "contain",
  },
  barcodeLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    marginTop: 3,
    color: "#111827",
  },
  qrWrapper: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 10,
  },
  qrImage: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  // High Visibility Ship To & Sender
  addressesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  shipToBox: {
    width: "60%",
    borderWidth: 1.5,
    borderColor: "#1a4a2e",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 10,
  },
  shipToHeader: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    backgroundColor: "#1a4a2e",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 2,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 3,
  },
  customerAddress: {
    fontSize: 9,
    color: "#1f2937",
    lineHeight: 1.35,
    marginBottom: 3,
  },
  customerCityHighlight: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#132e1f",
    marginTop: 2,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  customerPhoneBox: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  customerPhoneText: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#14532d",
  },
  senderBox: {
    width: "37%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9faf5",
    borderRadius: 4,
    padding: 10,
  },
  senderHeader: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 2,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  senderName: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#132e1f",
    marginBottom: 2,
  },
  senderText: {
    fontSize: 8,
    color: "#4b5563",
    lineHeight: 1.3,
  },
  // COD / Payment Badge Box
  paymentCalloutContainer: {
    marginBottom: 12,
  },
  codBigBox: {
    borderWidth: 2,
    borderColor: "#b45309",
    backgroundColor: "#fef3c7",
    borderRadius: 4,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codBigTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    letterSpacing: 0.5,
  },
  codBigAmount: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#78350f",
  },
  prepaidBigBox: {
    borderWidth: 1.5,
    borderColor: "#15803d",
    backgroundColor: "#dcfce7",
    borderRadius: 4,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prepaidTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#166534",
  },
  // Logistics Meta & Package summary
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  metaItem: {
    width: "24%",
  },
  metaItemLabel: {
    fontSize: 7.5,
    color: "#6b7280",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  metaItemValue: {
    fontSize: 8.5,
    color: "#111827",
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },
  // Package Items table (compact)
  itemsTable: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  itemsHeader: {
    flexDirection: "row",
    backgroundColor: "#1a4a2e",
    color: "#ffffff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    fontSize: 8,
    alignItems: "center",
  },
  colQty: { width: "12%", textAlign: "center", fontFamily: "Helvetica-Bold" },
  colItemDesc: { width: "68%", paddingRight: 6 },
  colItemSku: { width: "20%", textAlign: "right", color: "#6b7280" },
  // Footer / Instructions
  instructionsRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 7.5,
    color: "#6b7280",
  },
});

export function AWBDocument({ order }: { order: PDFOrderData }) {
  const currency = BUSINESS_INFO.currencySymbol;
  const barcodeValue = order.awbNumber || order.trackingNumber || order.shortId;

  return (
    <Document title={`PurestStem-AWB-${order.shortId}`} author={BUSINESS_INFO.brandName}>
      <Page size="A4" style={styles.page}>
        <View style={styles.labelContainer}>
          {/* Top Header */}
          <View style={styles.headerRow}>
            <View style={styles.logoSection}>
              {order.logoDataUriOrPath && (
                <Image style={styles.logo} src={order.logoDataUriOrPath} />
              )}
              <View>
                <Text style={styles.brandTitle}>{BUSINESS_INFO.brandName}</Text>
                <Text style={{ fontSize: 7.5, color: "#4b5563" }}>Herbal Care Logistics</Text>
              </View>
            </View>

            <View style={styles.orderRefSection}>
              <Text style={styles.docBadge}>AWB / SHIPPING LABEL</Text>
              <Text style={styles.orderNumberText}>Order {order.orderNumberFormatted}</Text>
              <Text style={styles.dateText}>Date: {order.formattedDate}</Text>
            </View>
          </View>

          {/* Barcode & QR Code Section */}
          <View style={styles.barcodeSection}>
            <View style={styles.barcodeWrapper}>
              {order.barcodeDataUri ? (
                <Image style={styles.barcodeImage} src={order.barcodeDataUri} />
              ) : null}
              <Text style={styles.barcodeLabel}>
                {order.awbNumber ? `AWB: ${order.awbNumber}` : `REF: ${barcodeValue}`}
              </Text>
            </View>

            {order.qrCodeDataUri && (
              <View style={styles.qrWrapper}>
                <Image style={styles.qrImage} src={order.qrCodeDataUri} />
              </View>
            )}
          </View>

          {/* Addresses Grid (SHIP TO + SENDER) */}
          <View style={styles.addressesGrid}>
            <View style={styles.shipToBox}>
              <Text style={styles.shipToHeader}>DELIVERY DESTINATION (SHIP TO)</Text>
              <Text style={styles.customerName}>{order.customerName}</Text>
              <Text style={styles.customerAddress}>{order.customerAddress}</Text>
              <Text style={styles.customerCityHighlight}>
                {order.customerCity.toUpperCase()}
                {order.customerPostalCode ? ` - ${order.customerPostalCode}` : ""}, PAKISTAN
              </Text>
              <View style={styles.customerPhoneBox}>
                <Text style={styles.customerPhoneText}>
                  DELIVERY CONTACT: {order.customerPhone}
                </Text>
              </View>
            </View>

            <View style={styles.senderBox}>
              <Text style={styles.senderHeader}>SENDER (FROM)</Text>
              <Text style={styles.senderName}>{BUSINESS_INFO.brandName}</Text>
              <Text style={styles.senderText}>{BUSINESS_INFO.fullAddress}</Text>
              <Text style={[styles.senderText, { marginTop: 4, fontFamily: "Helvetica-Bold" }]}>
                Helpline: {BUSINESS_INFO.phone}
              </Text>
              <Text style={styles.senderText}>Web: {BUSINESS_INFO.websiteUrl}</Text>
            </View>
          </View>

          {/* COD / Payment Badge Box */}
          <View style={styles.paymentCalloutContainer}>
            {order.isCOD ? (
              <View style={styles.codBigBox}>
                <View>
                  <Text style={styles.codBigTitle}>CASH ON DELIVERY (COD)</Text>
                  <Text style={{ fontSize: 8, color: "#92400e", marginTop: 1 }}>
                    Collect exact cash amount from customer upon delivery
                  </Text>
                </View>
                <Text style={styles.codBigAmount}>
                  {currency} {order.total.toLocaleString()}
                </Text>
              </View>
            ) : (
              <View style={styles.prepaidBigBox}>
                <Text style={styles.prepaidTitle}>PREPAID ORDER — DO NOT COLLECT CASH</Text>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#166534" }}>
                  PAID: {currency} {order.total.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {/* Logistics Metadata */}
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>Courier</Text>
              <Text style={styles.metaItemValue}>{order.courier || "To be assigned"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>Tracking / AWB</Text>
              <Text style={styles.metaItemValue}>{order.trackingNumber || order.awbNumber || "Standard Dispatch"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>Total Quantity</Text>
              <Text style={styles.metaItemValue}>{order.totalQuantity} pcs ({order.items.length} items)</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>Shipping Method</Text>
              <Text style={styles.metaItemValue}>{order.shippingMethod}</Text>
            </View>
          </View>

          {/* Compact Package Contents */}
          <View style={styles.itemsTable}>
            <View style={styles.itemsHeader}>
              <Text style={styles.colQty}>QTY</Text>
              <Text style={styles.colItemDesc}>PACKAGE CONTENTS / PRODUCTS</Text>
              <Text style={styles.colItemSku}>SKU</Text>
            </View>
            {order.items.map((item, idx) => (
              <View key={item.id || idx} style={styles.itemRow} wrap={false}>
                <Text style={styles.colQty}>{item.quantity} ×</Text>
                <View style={styles.colItemDesc}>
                  <Text style={{ fontFamily: "Helvetica-Bold", color: "#111827" }}>{item.name}</Text>
                  {item.weight && <Text style={{ fontSize: 7, color: "#6b7280" }}>{item.weight}</Text>}
                </View>
                <Text style={styles.colItemSku}>{item.sku || "—"}</Text>
              </View>
            ))}
          </View>

          {/* Delivery notes if any */}
          {order.notes && (
            <View style={{ marginBottom: 8, padding: 6, backgroundColor: "#fffbeb", borderRadius: 3, borderWidth: 1, borderColor: "#fde68a" }}>
              <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#92400e" }}>
                Delivery Note:
              </Text>
              <Text style={{ fontSize: 7.5, color: "#78350f" }}>{order.notes}</Text>
            </View>
          )}

          {/* Footer Guide */}
          <View style={styles.instructionsRow}>
            <Text style={styles.instructionText}>
              PurestStem Official Dispatch • Verified Order #{order.shortId} • {BUSINESS_INFO.websiteUrl}
            </Text>
            <Text style={styles.instructionText}>
              Logistics Helpline: {BUSINESS_INFO.phone}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
export default AWBDocument;
