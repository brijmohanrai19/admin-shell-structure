import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "active" | "draft" | "archived" | "pending" | "published";

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, string> = {
  active: "bg-success/10 text-success hover:bg-success/20",
  published: "bg-success/10 text-success hover:bg-success/20",
  draft: "bg-warning/10 text-warning hover:bg-warning/20",
  pending: "bg-primary/10 text-primary hover:bg-primary/20",
  archived: "bg-muted text-muted-foreground hover:bg-muted",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium capitalize", statusStyles[status])}
    >
      {status}
    </Badge>
  );
}
