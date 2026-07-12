import type { DashboardMetric, DashboardMetricTone } from "@/features/dashboard/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneClassNames: Record<DashboardMetricTone, string> = {
  blue: "before:bg-sky-400",
  green: "before:bg-emerald-400",
  orange: "before:bg-orange-400",
};

export function DashboardStatCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card
      className={cn(
        "relative min-h-20 rounded-none border-white/15 bg-card/70 py-0 shadow-none before:absolute before:inset-y-0 before:left-0 before:w-1",
        toneClassNames[metric.tone],
      )}
    >
      <CardContent className="flex h-full flex-col justify-center gap-2 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {metric.label}
        </p>
        <p className="font-heading text-3xl font-semibold leading-none tracking-tight">
          {metric.value}
        </p>
      </CardContent>
    </Card>
  );
}
