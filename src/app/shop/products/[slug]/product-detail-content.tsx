import { Check } from "lucide-react";
import { sanitizeHtml } from "@/lib/html-sanitizer";

export interface StructuredIngredient {
  name: string;
  description?: string;
}

export interface StructuredStep {
  step: number;
  instruction: string;
}

/** Splits a description (newline separated) into individual bullet points. */
export function splitDescription(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim().replace(/^[-•*·]\s*/, ""))
    .filter(Boolean);
}

/**
 * Splits a raw ingredient string (comma / semicolon / newline separated)
 * into a clean list of individual ingredient names.
 */
export function splitIngredients(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((item) => item.trim().replace(/^[-•*·]\s*/, "").replace(/[.;,]$/, ""))
    .filter(Boolean);
}

/**
 * Splits "how to use" prose into individual steps.
 */
export function splitSteps(text: string): string[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim().replace(/^[-•*·]\s*/, ""))
    .filter(Boolean);

  if (lines.length > 1) {
    return lines.map((line) => line.replace(/^\d+[.)]\s*/, ""));
  }

  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim().replace(/^[-•*·]\s*/, ""))
    .filter(Boolean);
}

/** Renders the ingredient list with structured botanical cards or pills. */
export function ProductIngredients({
  text,
  structured,
}: {
  text?: string | null;
  structured?: StructuredIngredient[] | null;
}) {
  if (structured && structured.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {structured.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="p-3.5 rounded-xl bg-green-50/70 border border-green-100 hover:border-green-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-green-700 shrink-0" strokeWidth={3} />
              <h3 className="font-bold text-xs sm:text-sm text-green-950">{item.name}</h3>
            </div>
            {item.description && (
              <p className="text-xs text-gray-600 mt-1 leading-relaxed pl-5">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  const items = text ? splitIngredients(text) : [];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-100 px-3.5 py-2 text-sm font-medium text-green-900 hover:bg-green-100 hover:border-green-200 transition-colors"
        >
          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" strokeWidth={3} />
          {item}
        </span>
      ))}
    </div>
  );
}

/** Renders the product description either as rich sanitized HTML or bullet points. */
export function ProductDescription({ text }: { text: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(text);

  if (isHtml) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }}
        className="prose"
      />
    );
  }

  const lines = splitDescription(text);

  return (
    <ul className="space-y-3">
      {lines.map((line, index) => (
        <li key={index} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-green-600"
          />
          <span className="leading-relaxed text-gray-700">{line}</span>
        </li>
      ))}
    </ul>
  );
}

/** Renders the "how to use" instructions as numbered timeline steps. */
export function ProductHowToUse({
  text,
  structured,
}: {
  text?: string | null;
  structured?: StructuredStep[] | null;
}) {
  if (structured && structured.length > 0) {
    return (
      <ol className="relative space-y-4">
        {structured.map((s, index) => (
          <li key={index} className="relative flex items-start gap-3.5">
            <span className="z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white shadow-sm shadow-green-700/20">
              {s.step || index + 1}
            </span>
            <p className="pt-1 text-sm text-gray-700 leading-relaxed">{s.instruction}</p>
          </li>
        ))}
      </ol>
    );
  }

  const steps = text ? splitSteps(text) : [];

  return (
    <ol className="relative">
      {steps.map((step, index) => (
        <li key={index} className="relative flex gap-4 pb-6 last:pb-0">
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[13px] top-9 bottom-0 w-px bg-green-100"
            />
          )}
          <span className="z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white shadow-sm shadow-green-700/20">
            {index + 1}
          </span>
          <p className="pt-1.5 text-sm text-gray-600 leading-relaxed">{step}</p>
        </li>
      ))}
    </ol>
  );
}
