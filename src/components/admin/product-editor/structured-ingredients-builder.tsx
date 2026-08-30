"use client";

import { useState } from "react";
import { Plus, X, Leaf, Sparkles } from "lucide-react";

export interface IngredientItem {
  name: string;
  description: string;
}

const HERBAL_PRESETS = [
  { name: "Amla (Indian Gooseberry)", description: "Rich in Vitamin C; strengthens hair follicles and prevents premature greying." },
  { name: "Reetha (Soapnut)", description: "Natural foaming botanical that cleanses hair gently without sulfates." },
  { name: "Shikakai", description: "Natural conditioner that adds softness, shine, and detangles hair." },
  { name: "Bhringraj (False Daisy)", description: "Known as the king of hair herbs; stimulates dormant follicles and reduces hair fall." },
  { name: "Organic Aloe Vera Extract", description: "Deeply hydrates scalp, soothes itching, and locks in natural moisture." },
  { name: "Pure Cold-Pressed Almond Oil", description: "Rich in Vitamin E and fatty acids; nourishes and softens dry hair." },
  { name: "Organic Coconut Oil", description: "Penetrates hair shaft to reduce protein loss and prevent split ends." },
  { name: "Brahmi (Bacopa Monnieri)", description: "Calms scalp irritation and promotes thicker, fuller hair strands." },
  { name: "Ashwagandha", description: "Adaptogenic herb that fights scalp stress and invigorates root health." },
  { name: "Organic Neem Extract", description: "Potent antibacterial herb that purifies scalp and clears dandruff." },
  { name: "Pure Rose Distillate", description: "Naturally balances pH and leaves a refreshing floral aroma." },
  { name: "Tea Tree Oil", description: "Antiseptic botanical that cleanses pores and maintains scalp hygiene." },
];

interface StructuredIngredientsBuilderProps {
  ingredients: IngredientItem[];
  onChange: (ingredients: IngredientItem[]) => void;
  rawLegacyText?: string;
  onLegacyTextChange?: (text: string) => void;
}

export default function StructuredIngredientsBuilder({
  ingredients,
  onChange,
  rawLegacyText = "",
  onLegacyTextChange,
}: StructuredIngredientsBuilderProps) {
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  function handleAdd() {
    if (!nameInput.trim()) return;
    onChange([...ingredients, { name: nameInput.trim(), description: descInput.trim() }]);
    setNameInput("");
    setDescInput("");
  }

  function handleRemove(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  function handleUpdate(index: number, patch: Partial<IngredientItem>) {
    onChange(ingredients.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function handleAddPreset(preset: IngredientItem) {
    if (ingredients.some((i) => i.name.toLowerCase() === preset.name.toLowerCase())) return;
    onChange([...ingredients, preset]);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-green-700" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Botanical Ingredients (Structured)
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold transition-colors border border-green-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showPresets ? "Hide Presets" : "Browse Herbal Presets"}
        </button>
      </div>

      {/* Preset Botanicals Picker */}
      {showPresets && (
        <div className="p-4 bg-green-50/70 rounded-xl border border-green-200/80 space-y-2">
          <p className="text-xs font-semibold text-green-950">Click any traditional herb to add:</p>
          <div className="flex flex-wrap gap-1.5">
            {HERBAL_PRESETS.map((p) => {
              const alreadyAdded = ingredients.some((i) => i.name.toLowerCase() === p.name.toLowerCase());
              return (
                <button
                  key={p.name}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => handleAddPreset(p)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    alreadyAdded
                      ? "bg-green-200/50 text-green-900 border-green-300 opacity-60 cursor-default"
                      : "bg-white text-gray-800 hover:border-green-600 hover:text-green-900 border-gray-200 shadow-2xs"
                  }`}
                >
                  + {p.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Ingredients List */}
      <div className="space-y-3">
        {ingredients.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 w-full">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdate(idx, { name: e.target.value })}
                placeholder="Ingredient Name (e.g. Amla)"
                className="sm:col-span-4 px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-600 outline-none"
              />
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                placeholder="Factual Function / Benefit (e.g. Strengthens hair roots naturally)"
                className="sm:col-span-8 px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-1 text-gray-400 hover:text-red-600 rounded-lg self-end sm:self-center"
              title="Remove Ingredient"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Add New Row Form */}
        <div className="p-3 bg-white rounded-xl border-2 border-dashed border-gray-200 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="New Ingredient Name (e.g. Bhringraj Extract)"
              className="sm:col-span-4 px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
            />
            <input
              type="text"
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              placeholder="Function / Benefit (e.g. Helps revitalize dry-feeling hair)"
              className="sm:col-span-8 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!nameInput.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-700 text-white hover:bg-green-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Ingredient
          </button>
        </div>
      </div>

      {/* Optional raw text fallback */}
      {onLegacyTextChange && (
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">
            Raw Ingredients Text (Optional comma-separated fallback)
          </label>
          <textarea
            rows={2}
            value={rawLegacyText}
            onChange={(e) => onLegacyTextChange(e.target.value)}
            placeholder="Amla, Reetha, Shikakai, Bhringraj, Aloe Vera, Purified Water..."
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
          />
        </div>
      )}
    </div>
  );
}
