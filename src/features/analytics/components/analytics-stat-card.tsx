import type { AnalyticsMetric, AnalyticsMetricTone } from "@/features/analytics/types";
import { cn } from "@/lib/utils";

const toneClasses: Record<AnalyticsMetricTone, string> = {
  blue: "border-sky-500/40 bg-sky-500/10 text-sky-100 shadow-[inset_3px_0_0_rgba(14,165,233,0.85)]",
  green:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[inset_3px_0_0_rgba(16,185,129,0.85)]",
  orange:
    "border-orange-500/40 bg-orange-500/10 text-orange-100 shadow-[inset_3px_0_0_rgba(249,115,22,0.85)]",
  rose: "border-rose-500/40 bg-rose-500/10 text-rose-100 shadow-[inset_3px_0_0_rgba(244,63,94,0.85)]",
};

export function AnalyticsStatCard({ metric }: { metric: AnalyticsMetric }) {
  return (
    <article
      className={cn(
        "rounded-xl border p-4 transition-transform hover:-translate-y-0.5",
        toneClasses[metric.tone],
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {metric.label}
      </p>
      <p className="mt-3 font-heading text-2xl font-semibold tracking-tight">{metric.value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{metric.helper}</p>
    </article>
  );
}
