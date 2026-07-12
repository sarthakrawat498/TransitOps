import { ExpenseCategory, VehicleStatus } from "@/generated/prisma/enums";
import * as analyticsReader from "@/server/modules/analytics/analytics.reader";
import type {
  AnalyticsDateRange,
  AnalyticsExpenseCategoryItem,
  AnalyticsFilters,
  AnalyticsMonthlySeriesItem,
  AnalyticsOverview,
  AnalyticsOverviewFilters,
  AnalyticsVehicleCostItem,
} from "@/server/modules/analytics/analytics.types";

const DEFAULT_MONTH_COUNT = 6;

function toNumber(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}

function round(value: number, digits = 0): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function percentage(part: number, total: number, digits = 1): number {
  if (total === 0) {
    return 0;
  }

  return round((part / total) * 100, digits);
}

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function endOfDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999),
  );
}

function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonths(date: Date, months: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
}

function resolveDateRange(filters: AnalyticsOverviewFilters): AnalyticsDateRange {
  const now = new Date();
  const defaultStart = addMonths(startOfMonth(now), -(DEFAULT_MONTH_COUNT - 1));

  return {
    startDate: startOfDay(filters.startDate ?? defaultStart),
    endDate: endOfDay(filters.endDate ?? now),
  };
}

function monthKey(date: Date) {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}`;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function buildMonthBuckets(range: AnalyticsDateRange) {
  const buckets = new Map<string, AnalyticsMonthlySeriesItem>();
  let cursor = startOfMonth(range.startDate);
  const lastMonth = startOfMonth(range.endDate);

  while (cursor <= lastMonth) {
    const key = monthKey(cursor);
    buckets.set(key, {
      month: key,
      label: monthLabel(cursor),
      revenue: 0,
      fuelCost: 0,
      maintenanceCost: 0,
      expenseCost: 0,
      operationalCost: 0,
    });
    cursor = addMonths(cursor, 1);
  }

  return buckets;
}

function addToMonth(
  buckets: Map<string, AnalyticsMonthlySeriesItem>,
  date: Date,
  key: keyof Pick<
    AnalyticsMonthlySeriesItem,
    "revenue" | "fuelCost" | "maintenanceCost" | "expenseCost"
  >,
  value: number,
) {
  const bucket = buckets.get(monthKey(date));
  if (!bucket) {
    return;
  }

  bucket[key] += value;
}

function finalizeMonthlySeries(buckets: Map<string, AnalyticsMonthlySeriesItem>) {
  return Array.from(buckets.values()).map((bucket) => ({
    ...bucket,
    revenue: round(bucket.revenue),
    fuelCost: round(bucket.fuelCost),
    maintenanceCost: round(bucket.maintenanceCost),
    expenseCost: round(bucket.expenseCost),
    operationalCost: round(bucket.fuelCost + bucket.maintenanceCost + bucket.expenseCost),
  }));
}

function getVehicleScope(filters: AnalyticsOverviewFilters) {
  return {
    vehicleType: filters.vehicleType,
    region: filters.region,
    vehicleId: filters.vehicleId,
  };
}

export async function getOverview(filters: AnalyticsOverviewFilters): Promise<AnalyticsOverview> {
  const dateRange = resolveDateRange(filters);
  const vehicleScope = getVehicleScope(filters);
  const scopedFilters = {
    ...vehicleScope,
    ...dateRange,
  };

  const [
    vehicles,
    activeVehicleCount,
    vehiclesOnTripCount,
    revenueTrips,
    fuelLogs,
    maintenanceLogs,
    expenses,
  ] = await Promise.all([
    analyticsReader.getVehiclesForAnalytics(vehicleScope),
    analyticsReader.getVehicleCount({
      ...vehicleScope,
      excludedVehicleStatus: VehicleStatus.RETIRED,
    }),
    analyticsReader.getVehicleCount({
      ...vehicleScope,
      vehicleStatus: VehicleStatus.ON_TRIP,
    }),
    analyticsReader.getCompletedRevenueTrips(scopedFilters),
    analyticsReader.getFuelLogs(scopedFilters),
    analyticsReader.getMaintenanceLogs(scopedFilters),
    analyticsReader.getExpenses(scopedFilters),
  ]);

  const monthBuckets = buildMonthBuckets(dateRange);
  const vehicleCosts = new Map<string, AnalyticsVehicleCostItem>();
  const expenseTotals = new Map<ExpenseCategory, number>();

  for (const vehicle of vehicles) {
    vehicleCosts.set(vehicle.id, {
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      status: vehicle.status,
      totalCost: 0,
      fuelCost: 0,
      maintenanceCost: 0,
      expenseCost: 0,
      revenue: 0,
      roiPercent: 0,
    });
  }

  const totalRevenue = revenueTrips.reduce((sum, trip) => {
    const revenue = toNumber(trip.revenue);
    const vehicleCost = vehicleCosts.get(trip.vehicleId);

    if (trip.completedAt) {
      addToMonth(monthBuckets, trip.completedAt, "revenue", revenue);
    }

    if (vehicleCost) {
      vehicleCost.revenue += revenue;
    }

    return sum + revenue;
  }, 0);

  const totalDistance = revenueTrips.reduce(
    (sum, trip) => sum + toNumber(trip.actualDistance ?? trip.plannedDistance),
    0,
  );

  const totalFuelLiters = fuelLogs.reduce((sum, log) => sum + toNumber(log.liters), 0);
  const totalFuelCost = fuelLogs.reduce((sum, log) => {
    const cost = toNumber(log.cost);
    const vehicleCost = vehicleCosts.get(log.vehicleId);

    addToMonth(monthBuckets, log.logDate, "fuelCost", cost);

    if (vehicleCost) {
      vehicleCost.fuelCost += cost;
      vehicleCost.totalCost += cost;
    }

    return sum + cost;
  }, 0);

  const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => {
    const cost = toNumber(log.cost);
    const vehicleCost = vehicleCosts.get(log.vehicleId);

    addToMonth(monthBuckets, log.startedAt, "maintenanceCost", cost);

    if (vehicleCost) {
      vehicleCost.maintenanceCost += cost;
      vehicleCost.totalCost += cost;
    }

    return sum + cost;
  }, 0);

  const totalExpenseCost = expenses.reduce((sum, expense) => {
    const amount = toNumber(expense.amount);
    const vehicleCost = vehicleCosts.get(expense.vehicleId);

    addToMonth(monthBuckets, expense.expenseDate, "expenseCost", amount);
    expenseTotals.set(expense.category, (expenseTotals.get(expense.category) ?? 0) + amount);

    if (vehicleCost) {
      vehicleCost.expenseCost += amount;
      vehicleCost.totalCost += amount;
    }

    return sum + amount;
  }, 0);

  const acquisitionCostByVehicle = new Map(
    vehicles.map((vehicle) => [vehicle.id, toNumber(vehicle.acquisitionCost)]),
  );
  const totalAcquisitionCost = Array.from(acquisitionCostByVehicle.values()).reduce(
    (sum, cost) => sum + cost,
    0,
  );
  const operationalCost = totalFuelCost + totalMaintenanceCost + totalExpenseCost;

  const topCostliestVehicles = Array.from(vehicleCosts.values())
    .map((vehicle) => {
      const acquisitionCost = acquisitionCostByVehicle.get(vehicle.vehicleId) ?? 0;

      return {
        ...vehicle,
        totalCost: round(vehicle.totalCost),
        fuelCost: round(vehicle.fuelCost),
        maintenanceCost: round(vehicle.maintenanceCost),
        expenseCost: round(vehicle.expenseCost),
        revenue: round(vehicle.revenue),
        roiPercent: percentage(vehicle.revenue - vehicle.totalCost, acquisitionCost),
      };
    })
    .filter((vehicle) => vehicle.totalCost > 0 || vehicle.revenue > 0)
    .sort((left, right) => right.totalCost - left.totalCost)
    .slice(0, 5);

  const expenseBreakdown: AnalyticsExpenseCategoryItem[] = Object.values(ExpenseCategory).map(
    (category) => {
      const amount = expenseTotals.get(category) ?? 0;

      return {
        category,
        amount: round(amount),
        percentage: percentage(amount, totalExpenseCost),
      };
    },
  );

  return {
    dateRange: {
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    },
    summary: {
      fuelEfficiencyKmPerLiter: totalFuelLiters > 0 ? round(totalDistance / totalFuelLiters, 1) : 0,
      fleetUtilizationPercent: percentage(vehiclesOnTripCount, activeVehicleCount),
      operationalCost: round(operationalCost),
      vehicleRoiPercent: percentage(totalRevenue - operationalCost, totalAcquisitionCost),
      totalRevenue: round(totalRevenue),
      totalFuelCost: round(totalFuelCost),
      totalMaintenanceCost: round(totalMaintenanceCost),
      totalExpenseCost: round(totalExpenseCost),
      completedTrips: revenueTrips.length,
      activeVehicles: activeVehicleCount,
    },
    monthlySeries: finalizeMonthlySeries(monthBuckets),
    topCostliestVehicles,
    expenseBreakdown,
  };
}

export async function getFilters(): Promise<AnalyticsFilters> {
  const [vehicleTypes, regions, vehicles] = await Promise.all([
    analyticsReader.getVehicleTypes(),
    analyticsReader.getVehicleRegions(),
    analyticsReader.getFilterVehicles(),
  ]);

  return {
    vehicleTypes: vehicleTypes.map((vehicle) => vehicle.type),
    regions: regions
      .map((vehicle) => vehicle.region)
      .filter((region): region is string => Boolean(region)),
    vehicles,
  };
}
