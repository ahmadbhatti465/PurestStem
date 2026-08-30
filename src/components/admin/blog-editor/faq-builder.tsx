"use client";

import { useState } from "react";
import { Plus, Trash2, HelpCircle, ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqBuilderProps {
  faqs: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
}

export default function FaqBuilder({ faqs, onChange }: FaqBuilderProps) {
  function addFaq() {
    onChange([...faqs, { question: "", answer: "" }]);
  }

  function updateFaq(index: number, field: "question" | "answer", val: string) {
    const next = [...faqs];
    next[index][field] = val;
    onChange(next);
  }

  function removeFaq(index: number) {
    onChange(faqs.filter((_, i) => i !== index));
  }

  function moveFaq(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === faqs.length - 1)
    )
      return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const next = [...faqs];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-green-700" />
          <div>
            <h3 className="text-sm font-bold text-gray-900">Frequently Asked Questions (FAQ Section)</h3>
            <p className="text-xs text-gray-500">
              Rendered visibly as interactive accordion + generates Schema.org FAQPage structured data.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold transition-colors border border-green-200/60"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Question
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-xs text-gray-500 mb-2">No FAQ items added yet.</p>
          <button
            type="button"
            onClick={addFaq}
            className="text-xs text-green-700 font-semibold hover:underline"
          >
            + Add your first FAQ question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-3 relative group transition-all hover:border-green-300"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-green-800 bg-green-100/80 px-2 py-0.5 rounded-full">
                  Question {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Move Up"
                    disabled={index === 0}
                    onClick={() => moveFaq(index, "up")}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Move Down"
                    disabled={index === faqs.length - 1}
                    onClick={() => moveFaq(index, "down")}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete Question"
                    onClick={() => removeFaq(index)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="e.g. How often should I apply herbal hair oil?"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Provide a clear, helpful, direct answer..."
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <div className="flex items-center gap-1.5 text-[11px] text-green-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{faqs.length} FAQ item(s) will be rendered visibly and included in Schema.org FAQPage.</span>
        </div>
      )}
    </div>
  );
}
