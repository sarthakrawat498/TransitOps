import { Badge } from "@/components/ui/badge";
import type { MaintenanceLogItem } from "@/features/maintenance/types";
import { cn } from "@/lib/utils";

type MaintenanceStatus = MaintenanceLogItem["status"];

const statusClassNames: Record<MaintenanceStatus, string> = {
  OPEN: "border-orange-500/40 bg-orange-500/80 text-orange-950",
  CLOSED: "border-lime-500/40 bg-lime-500/80 text-lime-950",
};

const statusLabels: Record<MaintenanceStatus, string> = {
  OPEN: "In Shop",
  CLOSED: "Completed",
};

export function MaintenanceStatusBadge({ status }: { status: MaintenanceStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-7 min-w-24 rounded-md text-xs font-semibold shadow-none",
        statusClassNames[status],
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}
