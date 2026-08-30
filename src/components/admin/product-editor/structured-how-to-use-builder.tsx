"use client";

import { useState } from "react";
import { Plus, X, ListOrdered, ArrowUp, ArrowDown } from "lucide-react";

export interface HowToUseStep {
  step: number;
  instruction: string;
}

interface StructuredHowToUseBuilderProps {
  steps: HowToUseStep[];
  onChange: (steps: HowToUseStep[]) => void;
  rawLegacyText?: string;
  onLegacyTextChange?: (text: string) => void;
}

export default function StructuredHowToUseBuilder({
  steps,
  onChange,
  rawLegacyText = "",
  onLegacyTextChange,
}: StructuredHowToUseBuilderProps) {
  const [stepInput, setStepInput] = useState("");

  function handleAdd() {
    if (!stepInput.trim()) return;
    const newSteps = [...steps, { step: steps.length + 1, instruction: stepInput.trim() }];
    onChange(newSteps);
    setStepInput("");
  }

  function handleRemove(index: number) {
    const updated = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step: i + 1 }));
    onChange(updated);
  }

  function handleUpdate(index: number, instruction: string) {
    onChange(steps.map((item, i) => (i === index ? { ...item, instruction } : item)));
  }

  function handleMove(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= steps.length) return;
    const reordered = [...steps];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    onChange(reordered.map((s, i) => ({ ...s, step: i + 1 })));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-green-700" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            How to Use (Step-by-Step Instructions)
          </h2>
        </div>
        <span className="text-xs text-gray-500">{steps.length} Steps</span>
      </div>

      <div className="space-y-3">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3"
          >
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <input
              type="text"
              value={item.instruction}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              placeholder={`Step ${idx + 1} instructions...`}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-600 outline-none"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMove(idx, "up")}
                className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                title="Move Step Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === steps.length - 1}
                onClick={() => handleMove(idx, "down")}
                className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                title="Move Step Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1 text-gray-400 hover:text-red-600 rounded-lg"
                title="Delete Step"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add Step Form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="e.g. Apply an appropriate amount to wet hair and massage gently for 2-3 minutes..."
            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!stepInput.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-700 text-white hover:bg-green-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Step
          </button>
        </div>
      </div>

      {onLegacyTextChange && (
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">
            Raw How-to-Use Text (Optional paragraph fallback)
          </label>
          <textarea
            rows={2}
            value={rawLegacyText}
            onChange={(e) => onLegacyTextChange(e.target.value)}
            placeholder="Wet hair thoroughly. Apply shampoo. Massage into scalp. Rinse with lukewarm water."
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
          />
        </div>
      )}
    </div>
  );
}
