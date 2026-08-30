"use client";

import { useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SeoAnalysisResult } from "@/lib/seo-analyzer";

interface SeoHealthPanelProps {
  analysis: SeoAnalysisResult;
}

export default function SeoHealthPanel({ analysis }: SeoHealthPanelProps) {
  const [filter, setFilter] = useState<"all" | "issues" | "passed">("all");
  const [expanded, setExpanded] = useState(true);

  const { healthScore, checks } = analysis;

  const filteredChecks = checks.filter((c) => {
    if (filter === "issues") return c.status === "warning" || c.status === "fail";
    if (filter === "passed") return c.status === "pass";
    return true;
  });

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warning").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  let scoreColor = "text-green-600 border-green-500 bg-green-50";
  let scoreBadge = "bg-green-100 text-green-800";
  let scoreLabel = "Strong SEO Health";

  if (healthScore < 60) {
    scoreColor = "text-red-600 border-red-500 bg-red-50";
    scoreBadge = "bg-red-100 text-red-800";
    scoreLabel = "Needs Immediate Attention";
  } else if (healthScore < 85) {
    scoreColor = "text-amber-600 border-amber-500 bg-amber-50";
    scoreBadge = "bg-amber-100 text-amber-800";
    scoreLabel = "Good - Minor Improvements";
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-700" />
            <div>
              <h3 className="text-sm font-bold text-gray-900">SEO Content Health</h3>
              <p className="text-[11px] text-gray-500">Real-time technical & editorial audit</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Score Display */}
        <div className="mt-4 flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-base ${scoreColor}`}
            >
              {healthScore}
            </div>
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreBadge}`}>
                {scoreLabel}
              </span>
              <div className="text-xs text-gray-500 mt-0.5">
                {passCount} passed • {warnCount} warnings • {failCount} issues
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Checklist */}
      {expanded && (
        <div className="p-5 space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({checks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("issues")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === "issues" ? "bg-amber-700 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Issues ({warnCount + failCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("passed")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === "passed" ? "bg-green-700 text-white" : "bg-green-50 text-green-800 hover:bg-green-100"
              }`}
            >
              Passed ({passCount})
            </button>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredChecks.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-start gap-2.5 text-xs"
              >
                {item.status === "pass" && (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                {item.status === "warning" && (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                {item.status === "fail" && (
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="text-gray-500 text-[11px] mt-0.5 leading-relaxed">
                    {item.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
