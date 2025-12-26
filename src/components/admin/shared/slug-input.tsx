import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SlugStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "available" }
  | { state: "taken"; conflict: { entity_type: string; entity_name: string } }
  | { state: "retired" };

export interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  entityType?: "exam" | "college" | "scholarship" | "campaign";
  disabled?: boolean;
}

// Mock API check function
const checkSlugAvailability = async (fullPath: string): Promise<SlugStatus> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock logic: taken if contains "test", retired if contains "old"
  if (fullPath.includes("test")) {
    return {
      state: "taken",
      conflict: { entity_type: "exam", entity_name: "Test Exam 2024" },
    };
  }
  if (fullPath.includes("old")) {
    return { state: "retired" };
  }
  return { state: "available" };
};

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SlugInput({
  value,
  onChange,
  prefix = "",
  entityType,
  disabled = false,
}: SlugInputProps) {
  const [status, setStatus] = useState<SlugStatus>({ state: "idle" });
  const debouncedValue = useDebounce(value, 500);

  // Format slug: lowercase, replace special chars with hyphens
  const formatSlug = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSlug(e.target.value);
    onChange(formatted);
  };

  // Check availability when debounced value changes
  useEffect(() => {
    if (!debouncedValue || disabled) {
      setStatus({ state: "idle" });
      return;
    }

    // Start checking
    setStatus({ state: "checking" });

    const fullPath = prefix ? `/${prefix}/${debouncedValue}` : `/${debouncedValue}`;

    checkSlugAvailability(fullPath).then((result) => {
      setStatus(result);
    });
  }, [debouncedValue, prefix, disabled]);

  // Get status indicator
  const getStatusIndicator = () => {
    switch (status.state) {
      case "checking":
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking availability...</span>
          </div>
        );
      case "available":
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Available</span>
          </div>
        );
      case "taken":
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="h-4 w-4" />
            <span>
              Already used by {status.conflict.entity_type}:{" "}
              {status.conflict.entity_name}
            </span>
          </div>
        );
      case "retired":
        return (
          <div className="flex items-center gap-2 text-sm text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Retired - cannot reuse</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Build full URL preview
  const fullPath = prefix ? `/${prefix}/${value}` : `/${value}`;

  return (
    <div className="space-y-2">
      <Label htmlFor="slug-input">URL Slug</Label>
      <div className="space-y-2">
        <Input
          id="slug-input"
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled || status.state === "checking"}
          placeholder="e.g., viteee-2026"
          className={cn(
            "font-mono",
            status.state === "available" && "border-green-500",
            status.state === "taken" && "border-red-500",
            status.state === "retired" && "border-yellow-500"
          )}
        />
        {getStatusIndicator()}
        {value && (
          <p className="text-xs text-muted-foreground">
            Preview: <span className="font-mono">{fullPath}</span>
          </p>
        )}
      </div>
    </div>
  );
}
