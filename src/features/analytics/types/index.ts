import type {
  AnalyticsFilters as AnalyticsFiltersResponseData,
  AnalyticsOverview as AnalyticsOverviewResponseData,
} from "@/server/modules/analytics/analytics.types";

export type { AnalyticsFiltersResponseData, AnalyticsOverviewResponseData };

export type AnalyticsPeriod = "last-6-months" | "last-12-months" | "year-to-date";

export interface AnalyticsOverviewQueryParams {
  startDate?: string;
  endDate?: string;
  vehicleType?: string;
  region?: string;
  vehicleId?: string;
}

export type AnalyticsFilterKey = "period" | "vehicleType" | "region" | "vehicleId";

export type AnalyticsFilterValues = Record<AnalyticsFilterKey, string>;

export interface AnalyticsFilterOption {
  label: string;
  value: string;
}

export interface AnalyticsFilter {
  key: AnalyticsFilterKey;
  label: string;
  options: AnalyticsFilterOption[];
}

export type AnalyticsMetricTone = "blue" | "green" | "orange" | "rose";

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string;
  helper: string;
  tone: AnalyticsMetricTone;
}

export interface AnalyticsMonthlyPoint {
  month: string;
  label: string;
  revenue: number;
  operationalCost: number;
  fuelCost: number;
  maintenanceCost: number;
  expenseCost: number;
}

export interface AnalyticsVehicleCostPoint {
  vehicleId: string;
  registrationNumber: string;
  totalCost: number;
  fuelCost: number;
  maintenanceCost: number;
  expenseCost: number;
  revenue: number;
  roiPercent: number;
}

export interface AnalyticsExpensePoint {
  category: string;
  label: string;
  amount: number;
  percentage: number;
}

export interface AnalyticsOverviewViewData {
  dateRangeLabel: string;
  metrics: AnalyticsMetric[];
  monthlySeries: AnalyticsMonthlyPoint[];
  topCostliestVehicles: AnalyticsVehicleCostPoint[];
  expenseBreakdown: AnalyticsExpensePoint[];
  costSummary: {
    fuel: string;
    maintenance: string;
    expenses: string;
    revenue: string;
  };
}
