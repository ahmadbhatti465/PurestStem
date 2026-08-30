"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { ProductSeoAnalysisResult } from "@/lib/product-seo-analyzer";

interface SeoHealthPanelProps {
  analysis: ProductSeoAnalysisResult;
}

export default function SeoHealthPanel({ analysis }: SeoHealthPanelProps) {
  const [showAllChecks, setShowAllChecks] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const score = analysis.healthScore;

  // Determine score color
  let scoreColor = "text-green-700 bg-green-50 border-green-200";
  let badgeColor = "bg-green-700 text-white";
  let label = "Excellent SEO Health";

  if (score < 50) {
    scoreColor = "text-red-700 bg-red-50 border-red-200";
    badgeColor = "bg-red-600 text-white";
    label = "Needs Optimization";
  } else if (score < 80) {
    scoreColor = "text-amber-700 bg-amber-50 border-amber-200";
    badgeColor = "bg-amber-600 text-white";
    label = "Good Technical Baseline";
  }

  const filteredChecks =
    selectedCategory === "all"
      ? analysis.checks
      : analysis.checks.filter((c) => c.category === selectedCategory);

  const passes = analysis.checks.filter((c) => c.status === "pass").length;
  const warnings = analysis.checks.filter((c) => c.status === "warning").length;
  const fails = analysis.checks.filter((c) => c.status === "fail").length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
      {/* Header & Main Score Display */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-700" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            SEO Content Health
          </h3>
        </div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {label}
        </span>
      </div>

      {/* Big Score Widget */}
      <div className="flex items-center gap-4 p-3.5 rounded-2xl border bg-gray-50/50">
        <div className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-display font-extrabold ${scoreColor}`}>
          <span className="text-2xl leading-none">{score}</span>
          <span className="text-[10px] font-sans font-semibold opacity-75">/ 100</span>
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-800">Checklist Summary</span>
            <span className="text-gray-500 font-mono text-[11px]">
              {passes} Passed · {warnings} Warnings · {fails} Failed
            </span>
          </div>

          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="bg-green-600 h-full transition-all duration-500"
              style={{ width: `${(passes / analysis.checks.length) * 100}%` }}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${(warnings / analysis.checks.length) * 100}%` }}
            />
            <div
              className="bg-red-500 h-full transition-all duration-500"
              style={{ width: `${(fails / analysis.checks.length) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-gray-500 leading-tight">
            Comprehensive audit of technical metadata, content depth, image accessibility, and schema.
          </p>
        </div>
      </div>

      {/* Pillar Breakdown Tabs */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
          Pillar Scores
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <span className="text-gray-600 font-medium">Product Data</span>
            <span className="font-bold text-gray-900">{analysis.pillarScores.data}%</span>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <span className="text-gray-600 font-medium">Content SEO</span>
            <span className="font-bold text-gray-900">{analysis.pillarScores.content}%</span>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <span className="text-gray-600 font-medium">Technical SEO</span>
            <span className="font-bold text-gray-900">{analysis.pillarScores.technical}%</span>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <span className="text-gray-600 font-medium">Image SEO</span>
            <span className="font-bold text-gray-900">{analysis.pillarScores.images}%</span>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <span className="text-gray-600 font-medium">Structured Schema</span>
            <span className="font-bold text-gray-900">{analysis.pillarScores.schema}%</span>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <span className="text-gray-600 font-medium">Internal Links</span>
            <span className="font-bold text-gray-900">{analysis.pillarScores.links}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Category Filter */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        {[
          { id: "all", label: "All" },
          { id: "technical", label: "Technical" },
          { id: "content", label: "Content" },
          { id: "keywords", label: "Keywords" },
          { id: "images", label: "Images" },
          { id: "data", label: "Data" },
          { id: "schema", label: "Schema" },
          { id: "links", label: "Links" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === tab.id
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Actionable Checklist Items */}
      <div className="space-y-2">
        {(showAllChecks ? filteredChecks : filteredChecks.slice(0, 5)).map((check) => {
          let icon = <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />;
          let border = "border-gray-200 bg-white";

          if (check.status === "warning") {
            icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />;
            border = "border-amber-200 bg-amber-50/40";
          } else if (check.status === "fail") {
            icon = <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />;
            border = "border-red-200 bg-red-50/40";
          }

          return (
            <div key={check.id} className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${border}`}>
              {icon}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{check.title}</div>
                <div className="text-[11px] text-gray-600 mt-0.5 leading-snug">{check.message}</div>
              </div>
            </div>
          );
        })}

        {filteredChecks.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllChecks(!showAllChecks)}
            className="w-full py-1.5 text-xs text-green-700 hover:text-green-800 font-semibold flex items-center justify-center gap-1 border border-green-200 rounded-xl bg-green-50/50"
          >
            {showAllChecks ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> View All {filteredChecks.length} Checks
              </>
            )}
          </button>
        )}
      </div>

      {/* SEO Health Disclaimer Note */}
      <div className="flex items-start gap-1.5 p-2 bg-gray-50 rounded-xl text-[11px] text-gray-500 border border-gray-200">
        <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
        <span>
          This score measures technical completeness and search engine readiness. It does not guarantee rankings.
        </span>
      </div>
    </div>
  );
}
