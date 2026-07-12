"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MaintenanceLogTable } from "@/features/maintenance/components/maintenance-log-table";
import { MaintenanceRecordForm } from "@/features/maintenance/components/maintenance-record-form";
import { useMaintenance } from "@/features/maintenance/hooks/use-maintenance";
import { matchesAnySearch, useSearch } from "@/providers/search-provider";

export function MaintenancePage() {
  const maintenanceQuery = useMaintenance();
  const { query } = useSearch();

  if (maintenanceQuery.isError) {
    return <MaintenanceErrorState onRetry={() => void maintenanceQuery.refetch()} />;
  }

  const overview = maintenanceQuery.data;
  const filteredLogs =
    overview?.logs.filter((log) =>
      matchesAnySearch([log.vehicle, log.service, log.status], query),
    ) ?? [];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Maintenance Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Maintenance</h1>
      </div>

      <Card>
        <CardContent className="min-h-[24rem] px-4 py-3">
          {maintenanceQuery.isLoading || !overview ? (
            <MaintenanceSkeleton />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.35fr)]">
              <MaintenanceRecordForm vehicles={overview.vehicles} />
              <MaintenanceLogTable logs={filteredLogs} />
            </div>
          )}
        </CardContent>
      </Card>
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
