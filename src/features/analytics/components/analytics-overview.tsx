"use client";

import { useMemo, useState } from "react";

import { AnalyticsFilters } from "@/features/analytics/components/analytics-filters";
import {
  CostSummaryPanel,
  ExpenseBreakdownChart,
  RevenueCostChart,
  TopCostliestVehiclesChart,
} from "@/features/analytics/components/analytics-charts";
import { AnalyticsStatCard } from "@/features/analytics/components/analytics-stat-card";
import { useAnalyticsFilters } from "@/features/analytics/hooks/use-analytics-filters";
import { useAnalyticsOverview } from "@/features/analytics/hooks/use-analytics-overview";
import type {
  AnalyticsFilter,
  AnalyticsFilterKey,
  AnalyticsFilterValues,
} from "@/features/analytics/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const defaultFilterValues: AnalyticsFilterValues = {
  period: "last-6-months",
  vehicleType: "all",
  region: "all",
  vehicleId: "all",
};

const loadingFilters: AnalyticsFilter[] = [
  { key: "period", label: "Period", options: [{ label: "Last 6 months", value: "last-6-months" }] },
  { key: "vehicleType", label: "Vehicle Type", options: [{ label: "All", value: "all" }] },
  { key: "region", label: "Region", options: [{ label: "All", value: "all" }] },
  { key: "vehicleId", label: "Vehicle", options: [{ label: "All", value: "all" }] },
];

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getPeriodRange(period: string) {
  const now = new Date();
  const endDate = toDateInputValue(now);
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  if (period === "last-12-months") {
    start.setUTCMonth(start.getUTCMonth() - 11);
  } else if (period === "year-to-date") {
    start.setUTCMonth(0);
  } else {
    start.setUTCMonth(start.getUTCMonth() - 5);
  }

  return {
    startDate: toDateInputValue(start),
    endDate,
  };
}

export function AnalyticsOverview() {
  const [filterValues, setFilterValues] = useState<AnalyticsFilterValues>(defaultFilterValues);
  const overviewParams = useMemo(
    () => ({
      ...getPeriodRange(filterValues.period),
      vehicleType: filterValues.vehicleType,
      region: filterValues.region,
      vehicleId: filterValues.vehicleId,
    }),
    [filterValues],
  );
  const filtersQuery = useAnalyticsFilters();
  const overviewQuery = useAnalyticsOverview(overviewParams);

  const handleFilterChange = (key: AnalyticsFilterKey, value: string) => {
    setFilterValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const hasError = filtersQuery.isError || overviewQuery.isError;

  if (hasError) {
    return (
      <AnalyticsErrorState
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
      <AnalyticsFilters
        disabled={filtersQuery.isLoading}
        filters={filters}
        values={filterValues}
        onChange={handleFilterChange}
      />

      {overviewQuery.isLoading || !overview ? (
        <AnalyticsOverviewSkeletonContent />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-card/50 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing analytics for{" "}
              <span className="font-medium text-foreground">{overview.dateRangeLabel}</span>
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              ROI = (Revenue - Cost) / Acquisition Cost
            </p>
          </div>

          <section
            aria-label="Analytics metrics"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            {overview.metrics.map((metric) => (
              <AnalyticsStatCard key={metric.id} metric={metric} />
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.75fr)]">
            <RevenueCostChart data={overview.monthlySeries} />
            <TopCostliestVehiclesChart data={overview.topCostliestVehicles} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.75fr)]">
            <ExpenseBreakdownChart data={overview.expenseBreakdown} />
            <CostSummaryPanel summary={overview.costSummary} />
          </div>
        </>
      )}
    </div>
  );
}

function AnalyticsOverviewSkeletonContent() {
  return (
    <>
      <Skeleton className="h-14 rounded-xl bg-white/10" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl bg-white/10" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.75fr)]">
        <Skeleton className="h-96 rounded-xl bg-white/10" />
        <Skeleton className="h-96 rounded-xl bg-white/10" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.75fr)]">
        <Skeleton className="h-72 rounded-xl bg-white/10" />
        <Skeleton className="h-72 rounded-xl bg-white/10" />
      </div>
    </>
  );
}

function AnalyticsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[24rem] w-full max-w-7xl items-center justify-center">
      <div className="max-w-md rounded-xl border border-white/10 bg-card/70 p-6 text-center">
        <h1 className="font-heading text-2xl font-semibold">Analytics unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The analytics API did not return the expected data. Check that the backend routes are
          running, then try again.
        </p>
        <Button type="button" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
