"use client";

import { useMemo, useState } from "react";

import { DashboardFilters } from "@/features/dashboard/components/dashboard-filters";
import { DashboardStatCard } from "@/features/dashboard/components/dashboard-stat-card";
import { RecentTripsTable } from "@/features/dashboard/components/recent-trips-table";
import { VehicleStatusPanel } from "@/features/dashboard/components/vehicle-status-panel";
import { useDashboardFilters } from "@/features/dashboard/hooks/use-dashboard-filters";
import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview";
import type {
  DashboardFilter,
  DashboardFilterKey,
  DashboardFilterValues,
} from "@/features/dashboard/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const defaultFilterValues: DashboardFilterValues = {
  vehicleType: "all",
  vehicleStatus: "all",
  region: "all",
  tripStatus: "all",
};

const loadingFilters: DashboardFilter[] = [
  { key: "vehicleType", label: "Vehicle Type", options: [{ label: "All", value: "all" }] },
  { key: "vehicleStatus", label: "Vehicle Status", options: [{ label: "All", value: "all" }] },
  { key: "region", label: "Region", options: [{ label: "All", value: "all" }] },
  { key: "tripStatus", label: "Trip Status", options: [{ label: "All", value: "all" }] },
];

export function DashboardOverview() {
  const [filterValues, setFilterValues] = useState<DashboardFilterValues>(defaultFilterValues);
  const overviewParams = useMemo(
    () => ({
      ...filterValues,
      recentTripsLimit: 4,
    }),
    [filterValues],
  );
  const filtersQuery = useDashboardFilters();
  const overviewQuery = useDashboardOverview(overviewParams);

  const handleFilterChange = (key: DashboardFilterKey, value: string) => {
    setFilterValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const hasError = filtersQuery.isError || overviewQuery.isError;

  if (hasError) {
    return (
      <DashboardErrorState
        onRetry={() => {
          void filtersQuery.refetch();
          void overviewQuery.refetch();
        }}
      />
    );
  }

  const filters = filtersQuery.data ?? loadingFilters;
  const overview = overviewQuery.data;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <h1 className="sr-only">TransitOps dashboard</h1>

      <DashboardFilters
        disabled={filtersQuery.isLoading}
        filters={filters}
        values={filterValues}
        onChange={handleFilterChange}
      />

      {overviewQuery.isLoading || !overview ? (
        <DashboardOverviewSkeletonContent />
      ) : (
        <>
          <section
            aria-label="Dashboard metrics"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
          >
            {overview.metrics.map((metric) => (
              <DashboardStatCard key={metric.id} metric={metric} />
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.65fr)]">
            <RecentTripsTable trips={overview.recentTrips} />
            <VehicleStatusPanel segments={overview.vehicleStatus} />
          </div>
        </>
      )}
    </div>
  );
}

function DashboardOverviewSkeletonContent() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-none bg-white/10" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.65fr)]">
        <Skeleton className="h-56 bg-white/10" />
        <Skeleton className="h-40 bg-white/10" />
      </div>
    </>
  );
}

function DashboardErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[24rem] w-full max-w-7xl items-center justify-center">
      <div className="max-w-md rounded-xl border border-white/10 bg-card/70 p-6 text-center">
        <h1 className="font-heading text-2xl font-semibold">Dashboard unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The dashboard API did not return the expected data. Check that the backend routes are
          running, then try again.
        </p>
        <Button type="button" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
