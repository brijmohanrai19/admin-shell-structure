import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Status = "draft" | "live" | "paused" | "archived" | "closed";

export interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<
  Status,
  { variant: "default" | "secondary" | "outline" | "destructive"; className: string }
> = {
  draft: {
    variant: "secondary",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
  live: {
    variant: "default",
    className: "bg-green-500 text-white hover:bg-green-600",
  },
  paused: {
    variant: "outline",
    className: "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
  },
  archived: {
    variant: "destructive",
    className: "bg-red-100 text-red-700 hover:bg-red-200",
  },
  closed: {
    variant: "outline",
    className: "border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100",
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  // Defensive fallback for invalid status values
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "font-medium capitalize",
        config.className,
        sizeClasses[size],
        "inline-flex items-center gap-1.5"
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}
