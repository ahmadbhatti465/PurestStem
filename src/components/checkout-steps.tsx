import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = ["Cart", "Details", "Complete"];

export function CheckoutSteps({ currentStep, className }: { currentStep: 1 | 2 | 3; className?: string }) {
  return (
    <ol className={cn("flex items-center gap-2 text-sm", className)} aria-label="Checkout progress">
      {steps.map((label, index) => {
        const step = index + 1;
        const done = step < currentStep || currentStep === 3;
        const current = step === currentStep;
        return (
          <li key={label} className="flex items-center gap-2" aria-current={current ? "step" : undefined}>
            {index > 0 && <span className="h-px w-5 bg-green-900/25 sm:w-10" aria-hidden="true" />}
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                done || current ? "bg-green-900 text-white" : "bg-green-100 text-green-900"
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : step}
            </span>
            <span className={current ? "font-medium text-green-950" : "text-gray-600"}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
