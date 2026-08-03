"use client";

import { cn } from "@/lib/utils";
import { ShoppingBag, Truck, Check } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

const steps = [
  { id: 1, label: "Cart", icon: ShoppingBag },
  { id: 2, label: "Details", icon: Truck },
  { id: 3, label: "Complete", icon: Check },
];

export function CheckoutSteps({ currentStep, className }: CheckoutStepsProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all border-2",
                    isActive
                      ? isCurrent
                        ? "bg-green-700 border-green-700 text-white shadow-lg shadow-green-700/20"
                        : "bg-green-700 border-green-700 text-white"
                      : "bg-white border-gray-200 text-gray-400"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-green-700 transition-all duration-500",
                      currentStep > step.id ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
