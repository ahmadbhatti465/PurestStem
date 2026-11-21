"use client";

import { useState, useRef, useEffect } from "react";
import { X, Download, Printer, FileText, Truck, Layers, Loader2, ExternalLink } from "lucide-react";

interface OrderDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderShortId: string;
  initialDocType?: "invoice" | "awb" | "combined";
}

export function OrderDocumentsModal({
  isOpen,
  onClose,
  orderId,
  orderShortId,
  initialDocType = "invoice",
}: OrderDocumentsModalProps) {
  const [docType, setDocType] = useState<"invoice" | "awb" | "combined">(initialDocType);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The parent re-mounts this modal (via key) each time it opens, so state
  // starts from the requested document; just move focus into the dialog.
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const previewUrl = `/api/admin/orders/${orderId}/${docType}?preview=true`;
  const downloadUrl = `/api/admin/orders/${orderId}/${docType}`;

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    } else {
      window.open(previewUrl, "_blank");
    }
  };

  /** Fetch first, so a server error shows a message instead of saving a broken "PDF". */
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Unable to download this document.");
      }
      const blob = await res.blob();
      const match = res.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = match?.[1] || `PurestStem-${docType}-${orderShortId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to download this document.");
    } finally {
      setDownloading(false);
    }
  };

  const getDocTitle = () => {
    switch (docType) {
      case "awb":
        return "AWB / Shipping Label";
      case "combined":
        return "Invoice + AWB Combined";
      case "invoice":
      default:
        return "Tax Invoice";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${getDocTitle()} for order ${orderShortId}`}
        className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
      >
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-[#132e1f] text-white flex items-center justify-between gap-4 border-b border-green-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base text-white">
                  {getDocTitle()} — Order #{orderShortId}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-800 text-green-100 border border-green-700/50">
                  PurestStem
                </span>
              </div>
              <p className="text-xs text-green-200/70 hidden sm:block">
                A4 Official Logistics & Accounting Document
              </p>
            </div>
          </div>

          {/* Doc Type Selector */}
          <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setLoading(true);
                setDocType("invoice");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                docType === "invoice"
                  ? "bg-[#1a4a2e] text-white shadow-sm border border-green-600/40"
                  : "text-green-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Invoice</span>
            </button>

            <button
              onClick={() => {
                setLoading(true);
                setDocType("awb");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                docType === "awb"
                  ? "bg-[#1a4a2e] text-white shadow-sm border border-green-600/40"
                  : "text-green-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AWB Label</span>
            </button>

            <button
              onClick={() => {
                setLoading(true);
                setDocType("combined");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                docType === "combined"
                  ? "bg-[#1a4a2e] text-white shadow-sm border border-green-600/40"
                  : "text-green-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Combined</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Document"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-sm disabled:opacity-60"
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Download
            </button>

            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-all ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-xs">
              <Loader2 className="w-8 h-8 text-[#1a4a2e] animate-spin mb-2" />
              <p className="text-sm font-medium text-gray-700">Rendering document...</p>
              <p className="text-xs text-gray-400 mt-0.5">Generating high-resolution PurestStem PDF</p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={previewUrl}
            onLoad={() => setLoading(false)}
            className="w-full h-full border-0"
            title={`${getDocTitle()} - ${orderShortId}`}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderDocumentsModal;
