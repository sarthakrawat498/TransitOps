import { TripStatus } from "@/generated/prisma/enums";
import { getTripLifecycleSteps } from "@/features/trips/services/trips.mappers";
import { cn } from "@/lib/utils";

const stepClassNames = {
  [TripStatus.DRAFT]: "bg-emerald-500",
  [TripStatus.DISPATCHED]: "bg-sky-400",
  [TripStatus.COMPLETED]: "bg-slate-500",
  [TripStatus.CANCELLED]: "bg-slate-600",
};

export function TripLifecycle() {
  const steps = getTripLifecycleSteps(TripStatus.DISPATCHED);

  return (
    <section aria-label="Trip lifecycle" className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Trip Lifecycle
      </p>
      <div className="grid grid-cols-4 gap-0">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-center gap-2">
            {index < steps.length - 1 ? (
              <span
                className="absolute top-3 left-1/2 h-px w-full bg-white/15"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 size-4 rounded-full border border-white/20",
                step.isActive ? stepClassNames[step.id] : "bg-slate-700",
              )}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                step.isActive ? "text-sky-200" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
