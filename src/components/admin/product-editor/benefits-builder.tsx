"use client";

import { useState } from "react";
import { Plus, X, CheckCircle, Sparkles } from "lucide-react";

interface BenefitsBuilderProps {
  benefits: string[];
  onChange: (benefits: string[]) => void;
}

const COMMON_BENEFITS = [
  "Helps cleanse hair and scalp gently without stripping moisture",
  "Helps improve the feel of dry and damaged hair strands",
  "Formulated with genuine cold-pressed botanical oils",
  "Soothes dry, itchy, or flaky scalp sensations",
  "Adds natural lustre and smooth manageability",
  "Suitable for regular and daily hair-care routines",
  "Non-greasy, fast-absorbing botanical nourishment",
  "Free from artificial fragrances and harsh chemical dyes",
];

export default function BenefitsBuilder({
  benefits,
  onChange,
}: BenefitsBuilderProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleAdd() {
    if (!input.trim()) return;
    onChange([...benefits, input.trim()]);
    setInput("");
  }

  function handleRemove(index: number) {
    onChange(benefits.filter((_, i) => i !== index));
  }

  function handleAddSuggestion(text: string) {
    if (benefits.includes(text)) return;
    onChange([...benefits, text]);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-700" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Product Benefits (Bullet Points)
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold hover:underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showSuggestions ? "Hide Suggestions" : "Factual Suggestions"}
        </button>
      </div>

      {showSuggestions && (
        <div className="p-3 bg-green-50/70 rounded-xl border border-green-200/80 space-y-1.5">
          <p className="text-xs font-semibold text-green-950">Add factual benefit bullet points:</p>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_BENEFITS.map((b) => (
              <button
                key={b}
                type="button"
                disabled={benefits.includes(b)}
                onClick={() => handleAddSuggestion(b)}
                className={`text-xs px-2.5 py-1 rounded-lg border text-left transition-all ${
                  benefits.includes(b)
                    ? "bg-green-100 text-green-800 border-green-200 opacity-60"
                    : "bg-white text-gray-700 hover:border-green-600 border-gray-200"
                }`}
              >
                + {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bullet items */}
      <div className="space-y-2">
        {benefits.map((b, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200"
          >
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span className="flex-1 text-xs text-gray-800">{b}</span>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-gray-400 hover:text-red-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Add Input */}
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="e.g. Deeply cleanses and conditions without stripping natural moisture"
            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-700 text-white hover:bg-green-800 rounded-xl text-xs font-semibold disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Benefit
          </button>
        </div>
      </div>
    </div>
  );
}
