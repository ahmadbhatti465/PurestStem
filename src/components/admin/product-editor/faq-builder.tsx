"use client";

import { useState } from "react";
import { Plus, X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqBuilderProps {
  faqs: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
}

export default function FaqBuilder({ faqs, onChange }: FaqBuilderProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function handleAdd() {
    if (!question.trim() || !answer.trim()) return;
    onChange([...faqs, { question: question.trim(), answer: answer.trim() }]);
    setQuestion("");
    setAnswer("");
  }

  function handleRemove(index: number) {
    onChange(faqs.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  }

  function handleUpdate(index: number, patch: Partial<FaqItem>) {
    onChange(faqs.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-green-700" />
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-xs text-gray-500">
              Visible on the product page and automatically included in FAQPage Schema.org JSON-LD.
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-500 font-medium">{faqs.length} FAQs</span>
      </div>

      {/* FAQ list */}
      <div className="space-y-2">
        {faqs.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                  <span className="text-xs font-bold text-green-700">Q{idx + 1}.</span>
                  <span className="text-xs font-semibold text-gray-900 truncate">
                    {item.question || "Untitled Question"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Question</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => handleUpdate(idx, { question: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Answer</label>
                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) => handleUpdate(idx, { answer: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New FAQ */}
        <div className="p-4 bg-white rounded-xl border-2 border-dashed border-gray-200 space-y-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How often should I use this herbal shampoo?"
            className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-600"
          />
          <textarea
            rows={2}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="e.g. For best results, use 2 to 3 times a week during regular bathing."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!question.trim() || !answer.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-700 text-white hover:bg-green-800 rounded-xl text-xs font-semibold disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            Add FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
