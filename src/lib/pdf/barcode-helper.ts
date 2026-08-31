import bwipjs from "bwip-js/node";
import QRCode from "qrcode";

/**
 * Generates a clean Code 128 Barcode as a Base64 PNG data URL.
 */
export async function generateBarcodeDataUrl(text: string): Promise<string> {
  try {
    const pngBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: text,
      scale: 3,
      height: 12,
      includetext: false,
      textxalign: "center",
      backgroundcolor: "ffffff",
    });
    return `data:image/png;base64,${pngBuffer.toString("base64")}`;
  } catch (error) {
    console.error("[Barcode Generation Error]", error);
    return "";
  }
}

/**
 * Generates a high-contrast QR Code as a Base64 PNG data URL.
 */
export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 180,
      color: {
        dark: "#132e1f",
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("[QR Code Generation Error]", error);
    return "";
  }
}
