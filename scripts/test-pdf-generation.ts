import "dotenv/config";
import { prisma } from "../src/lib/db";
import { generateOrderPDF, prepareOrderPDFData } from "../src/lib/pdf/generator";
import fs from "fs";
import path from "path";

async function runTests() {
  console.log("==========================================");
  console.log("▶ STARTING PURESTSTEM PDF & AWB SYSTEM TESTS");
  console.log("==========================================\n");

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    take: 10,
  });

  console.log(`Found ${orders.length} real orders in the database for validation.\n`);

  const outputDir = path.join(process.cwd(), "data", "test-generated-pdfs");
  fs.mkdirSync(outputDir, { recursive: true });

  for (const order of orders) {
    const shortId = order.id.slice(-6).toUpperCase();
    console.log(`------------------------------------------`);
    console.log(`Testing Order #${shortId} (ID: ${order.id})`);
    console.log(`Customer: ${order.name} | City: ${order.city} | Phone: ${order.phone}`);
    console.log(`Payment: ${order.paymentMethod} | Status: ${order.status} | Total: Rs ${order.total}`);
    console.log(`Items count: ${order.items.length}`);

    // 1. Validate PDF Data Preparation
    const pdfData = await prepareOrderPDFData(order.id);
    if (!pdfData) {
      throw new Error(`Failed to prepare PDF data for order ${order.id}`);
    }

    console.log(`✓ Invoice Number: ${pdfData.invoiceNumber}`);
    console.log(`✓ Barcode generated: ${!!pdfData.barcodeDataUri}`);
    console.log(`✓ QR code generated: ${!!pdfData.qrCodeDataUri}`);
    console.log(`✓ Logo data URI ready: ${!!pdfData.logoDataUriOrPath}`);

    // CRITICAL: Ensure NO email exists in customer info on document
    if ("customerEmail" in pdfData || "email" in pdfData) {
      throw new Error(`CRITICAL SECURITY/PRIVACY VIOLATION: Email found in PDF data object!`);
    }

    // 2. Generate Invoice PDF
    const invoiceResult = await generateOrderPDF(order.id, "invoice");
    if (!invoiceResult || !invoiceResult.buffer || invoiceResult.buffer.length === 0) {
      throw new Error(`Invoice PDF generation failed for order ${order.id}`);
    }
    const invoicePath = path.join(outputDir, invoiceResult.filename);
    fs.writeFileSync(invoicePath, invoiceResult.buffer);
    console.log(`✓ Invoice PDF generated: ${invoiceResult.filename} (${invoiceResult.buffer.length} bytes)`);

    // 3. Generate AWB PDF
    const awbResult = await generateOrderPDF(order.id, "awb");
    if (!awbResult || !awbResult.buffer || awbResult.buffer.length === 0) {
      throw new Error(`AWB PDF generation failed for order ${order.id}`);
    }
    const awbPath = path.join(outputDir, awbResult.filename);
    fs.writeFileSync(awbPath, awbResult.buffer);
    console.log(`✓ AWB PDF generated: ${awbResult.filename} (${awbResult.buffer.length} bytes)`);

    // 4. Generate Combined PDF
    const combinedResult = await generateOrderPDF(order.id, "combined");
    if (!combinedResult || !combinedResult.buffer || combinedResult.buffer.length === 0) {
      throw new Error(`Combined PDF generation failed for order ${order.id}`);
    }
    const combinedPath = path.join(outputDir, combinedResult.filename);
    fs.writeFileSync(combinedPath, combinedResult.buffer);
    console.log(`✓ Combined PDF generated: ${combinedResult.filename} (${combinedResult.buffer.length} bytes)`);

    // 5. Test deterministic invoice number stability
    const pdfData2 = await prepareOrderPDFData(order.id);
    if (pdfData2?.invoiceNumber !== pdfData.invoiceNumber) {
      throw new Error(`Invoice number is not deterministic! ${pdfData2?.invoiceNumber} vs ${pdfData.invoiceNumber}`);
    }
    console.log(`✓ Deterministic invoice number stability confirmed: ${pdfData.invoiceNumber}`);
  }

  console.log("\n==========================================");
  console.log("✅ ALL ORDER PDF TESTS PASSED SUCCESSFULLY");
  console.log(`All sample documents saved to: ${outputDir}`);
  console.log("==========================================");
}

runTests()
  .catch((err) => {
    console.error("❌ Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
