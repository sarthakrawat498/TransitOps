import type { VehicleStatusSegment } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

export function VehicleStatusPanel({ segments }: { segments: VehicleStatusSegment[] }) {
  return (
    <section className="space-y-3" aria-labelledby="vehicle-status-heading">
      <h2
        id="vehicle-status-heading"
        className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        Vehicle Status
      </h2>
      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.id} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
            <span className="text-xs text-muted-foreground">{segment.label}</span>
            <div className="flex items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-sm bg-white/10">
                <div
                  className={cn("h-full rounded-sm", segment.colorClassName)}
                  style={{ width: `${segment.percentage}%` }}
                  aria-label={`${segment.label}: ${segment.percentage}%`}
                />
              </div>
              <span className="w-8 text-right text-xs text-muted-foreground">{segment.count}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
