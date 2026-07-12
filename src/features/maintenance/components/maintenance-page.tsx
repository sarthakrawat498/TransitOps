"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MaintenanceLogTable } from "@/features/maintenance/components/maintenance-log-table";
import { MaintenanceRecordForm } from "@/features/maintenance/components/maintenance-record-form";
import { useMaintenance } from "@/features/maintenance/hooks/use-maintenance";

export function MaintenancePage() {
  const maintenanceQuery = useMaintenance();

  if (maintenanceQuery.isError) {
    return <MaintenanceErrorState onRetry={() => void maintenanceQuery.refetch()} />;
  }

  const overview = maintenanceQuery.data;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <h1 className="sr-only">Maintenance</h1>

      <div className="min-h-[32rem] rounded-sm border border-white/15 bg-[#0f0f0f] px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        {maintenanceQuery.isLoading || !overview ? (
          <MaintenanceSkeleton />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.35fr)]">
            <MaintenanceRecordForm vehicles={overview.vehicles} />
            <MaintenanceLogTable logs={overview.logs} />
          </div>
        )}
      </div>
    </div>
  );
}

function MaintenanceSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.35fr)]">
      <Skeleton className="h-80 rounded-none bg-white/10" />
      <Skeleton className="h-56 rounded-none bg-white/10" />
    </div>
  );
}

function MaintenanceErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[24rem] w-full max-w-7xl items-center justify-center">
      <div className="max-w-md rounded-xl border border-white/10 bg-card/70 p-6 text-center">
        <h1 className="font-heading text-2xl font-semibold">Maintenance unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The maintenance API did not return the expected data. Check the backend, then try again.
        </p>
        <Button type="button" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
