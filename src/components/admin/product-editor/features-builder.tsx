"use client";

import { useState } from "react";
import { Plus, X, Tag } from "lucide-react";

interface FeaturesBuilderProps {
  features: string[];
  onChange: (features: string[]) => void;
}

const COMMON_FEATURES = [
  "100% Herbal & Botanical",
  "Sulfate-Free",
  "Paraben-Free",
  "Cruelty-Free",
  "Silicon-Free",
  "Mineral Oil-Free",
  "Cold-Pressed Oils",
  "Made in Pakistan",
  "Eco-Conscious Packaging",
  "Dermatologically Tested",
  "Safe for Daily Use",
  "Unisex Formulation",
];

export default function FeaturesBuilder({
  features,
  onChange,
}: FeaturesBuilderProps) {
  const [input, setInput] = useState("");

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed || features.includes(trimmed)) return;
    onChange([...features, trimmed]);
    setInput("");
  }

  function handleRemove(featureToRemove: string) {
    onChange(features.filter((f) => f !== featureToRemove));
  }

  function handleTogglePreset(preset: string) {
    if (features.includes(preset)) {
      handleRemove(preset);
    } else {
      onChange([...features, preset]);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-green-700" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Key Features & Badges
          </h2>
        </div>
        <span className="text-xs text-gray-500">{features.length} Badges</span>
      </div>

      {/* Preset Badges */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">Click to toggle true product attributes:</p>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_FEATURES.map((f) => {
            const isSelected = features.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => handleTogglePreset(f)}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                  isSelected
                    ? "bg-green-700 text-white border-green-700 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-green-600 hover:bg-green-50"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected tags + Custom Add */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="flex flex-wrap gap-1.5 min-h-[38px] items-center p-2 bg-gray-50 rounded-xl border border-gray-200">
          {features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 bg-green-50 text-green-900 text-xs font-semibold px-2.5 py-1 rounded-lg border border-green-200"
            >
              {f}
              <button
                type="button"
                onClick={() => handleRemove(f)}
                className="text-green-600 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={features.length === 0 ? "Add custom feature..." : "Type more..."}
            className="flex-1 min-w-[120px] text-xs outline-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
