import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li
              key={step.title}
              className={cn(
                "relative flex-1",
                index !== steps.length - 1 && "pr-8"
              )}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted
                      ? "border-primary bg-primary"
                      : isCurrent
                      ? "border-primary bg-card"
                      : "border-border bg-card"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-10 top-1/2 h-0.5 w-full -translate-y-1/2",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>

              <div className="mt-3">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
