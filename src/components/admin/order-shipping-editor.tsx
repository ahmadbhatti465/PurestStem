"use client";

import { useState } from "react";
import { Truck, Hash, Check, Loader2, Save } from "lucide-react";

interface OrderShippingEditorProps {
  orderId: string;
  initialCourier?: string | null;
  initialAwbNumber?: string | null;
  initialTrackingNumber?: string | null;
  onSaved?: (data: { courier: string | null; awbNumber: string | null; trackingNumber: string | null }) => void;
}

const COURIER_OPTIONS = [
  { value: "", label: "Select Courier (Optional)" },
  { value: "Trax", label: "Trax Logistics" },
  { value: "Call Courier", label: "Call Courier" },
  { value: "TCS", label: "TCS Express" },
  { value: "Leopards", label: "Leopards Courier" },
  { value: "PostEx", label: "PostEx" },
  { value: "M&P", label: "M&P Express" },
  { value: "Rider", label: "Rider Delivery" },
  { value: "Self Delivery", label: "Self / Local Rider" },
];

export function OrderShippingEditor({
  orderId,
  initialCourier,
  initialAwbNumber,
  initialTrackingNumber,
  onSaved,
}: OrderShippingEditorProps) {
  const [courier, setCourier] = useState(initialCourier || "");
  const [awbNumber, setAwbNumber] = useState(initialAwbNumber || initialTrackingNumber || "");
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [customCourier, setCustomCourier] = useState(
    initialCourier && !COURIER_OPTIONS.some((o) => o.value === initialCourier) ? initialCourier : ""
  );
  const [isCustomMode, setIsCustomMode] = useState(
    !!initialCourier && !COURIER_OPTIONS.some((o) => o.value === initialCourier && o.value !== "")
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    const selectedCourier = isCustomMode ? customCourier : courier;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipping`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courier: selectedCourier || null,
          awbNumber: awbNumber || null,
          trackingNumber: awbNumber || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update shipping info");

      setSavedSuccess(true);
      if (onSaved) {
        onSaved({
          courier: selectedCourier || null,
          awbNumber: awbNumber || null,
          trackingNumber: awbNumber || null,
        });
      }
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save shipping & AWB information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-lg border border-gray-100 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-[#1a4a2e]" />
          Courier & AWB Tracking
        </h5>
        {savedSuccess && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Courier Selector */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Courier Partner
          </label>
          {!isCustomMode ? (
            <div className="space-y-1">
              <select
                value={courier}
                onChange={(e) => {
                  if (e.target.value === "other") {
                    setIsCustomMode(true);
                    setCustomCourier(courier);
                  } else {
                    setCourier(e.target.value);
                  }
                }}
                className="w-full text-xs font-medium rounded-lg border border-gray-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
              >
                {COURIER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                <option value="other">Custom Courier...</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Enter courier name"
                value={customCourier}
                onChange={(e) => setCustomCourier(e.target.value)}
                className="w-full text-xs rounded-lg border border-gray-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setCustomCourier("");
                  setCourier("");
                }}
                className="text-[10px] text-gray-400 hover:text-gray-600 px-1"
              >
                List
              </button>
            </div>
          )}
        </div>

        {/* Tracking / AWB Number Input */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
            AWB / Tracking Number
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. TR-98234812"
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value)}
              className="w-full text-xs font-medium rounded-lg border border-gray-200 pl-7 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <Hash className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a4a2e] hover:bg-[#132e1f] text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-3 h-3" /> Save Shipping Info
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default OrderShippingEditor;
