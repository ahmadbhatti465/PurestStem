import { Check } from "lucide-react";

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
 * Splits "how to use" prose into individual steps. If the text already uses
 * line breaks, each line becomes a step; otherwise it splits on sentence
 * boundaries.
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

/** Renders the ingredient list as a modern pill/chip grid. */
export function ProductIngredients({ text }: { text: string }) {
  const items = splitIngredients(text);

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

/** Renders the product description as a clean bullet list. */
export function ProductDescription({ text }: { text: string }) {
  const lines = splitDescription(text);

  return (
    <ul className="space-y-3">
      {lines.map((line, index) => (
        <li key={index} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-green-600"
          />
          <span className="text-gray-700 text-base sm:text-lg leading-relaxed">{line}</span>
        </li>
      ))}
    </ul>
  );
}

/** Renders the "how to use" instructions as numbered timeline steps. */
export function ProductHowToUse({ text }: { text: string }) {
  const steps = splitSteps(text);

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
