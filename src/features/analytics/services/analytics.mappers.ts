import type {
  AnalyticsFilter,
  AnalyticsFiltersResponseData,
  AnalyticsMetric,
  AnalyticsOverviewResponseData,
  AnalyticsOverviewViewData,
  AnalyticsPeriod,
} from "@/features/analytics/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const periodOptions: Array<{ label: string; value: AnalyticsPeriod }> = [
  { label: "Last 6 months", value: "last-6-months" },
  { label: "Last 12 months", value: "last-12-months" },
  { label: "Year to date", value: "year-to-date" },
];

function humanizeValue(value: string) {
  return value
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function withAllOption(values: string[]) {
  return [
    { label: "All", value: "all" },
    ...values.map((value) => ({
      label: humanizeValue(value),
      value,
    })),
  ];
}

function formatDateRange(data: AnalyticsOverviewResponseData) {
  const startDate = new Date(data.dateRange.startDate);
  const endDate = new Date(data.dateRange.endDate);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

function mapMetrics(data: AnalyticsOverviewResponseData): AnalyticsMetric[] {
  const { summary } = data;

  return [
    {
      id: "fuel-efficiency",
      label: "Fuel Efficiency",
      value: `${formatNumber(summary.fuelEfficiencyKmPerLiter)} km/L`,
      helper: "Completed trip distance / fuel liters",
      tone: "blue",
    },
    {
      id: "fleet-utilization",
      label: "Fleet Utilization",
      value: `${formatNumber(summary.fleetUtilizationPercent)}%`,
      helper: `${summary.activeVehicles} active vehicles in scope`,
      tone: "green",
    },
    {
      id: "operational-cost",
      label: "Operational Cost",
      value: formatCurrency(summary.operationalCost),
      helper: "Fuel + maintenance + expenses",
      tone: "orange",
    },
    {
      id: "vehicle-roi",
      label: "Vehicle ROI",
      value: `${formatNumber(summary.vehicleRoiPercent)}%`,
      helper: `${formatCurrency(summary.totalRevenue)} revenue from completed trips`,
      tone: summary.vehicleRoiPercent >= 0 ? "green" : "rose",
    },
  ];
}

export function mapAnalyticsFilters(data: AnalyticsFiltersResponseData): AnalyticsFilter[] {
  return [
    {
      key: "period",
      label: "Period",
      options: periodOptions,
    },
    {
      key: "vehicleType",
      label: "Vehicle Type",
      options: withAllOption(data.vehicleTypes),
    },
    {
      key: "region",
      label: "Region",
      options: withAllOption(data.regions),
    },
    {
      key: "vehicleId",
      label: "Vehicle",
      options: [
        { label: "All", value: "all" },
        ...data.vehicles.map((vehicle) => ({
          label: vehicle.registrationNumber,
          value: vehicle.id,
        })),
      ],
    },
  ];
}

export function mapAnalyticsOverview(
  data: AnalyticsOverviewResponseData,
): AnalyticsOverviewViewData {
  return {
    dateRangeLabel: formatDateRange(data),
    metrics: mapMetrics(data),
    monthlySeries: data.monthlySeries,
    topCostliestVehicles: data.topCostliestVehicles,
    expenseBreakdown: data.expenseBreakdown.map((item) => ({
      category: item.category,
      label: humanizeValue(item.category),
      amount: item.amount,
      percentage: item.percentage,
    })),
    costSummary: {
      fuel: formatCurrency(data.summary.totalFuelCost),
      maintenance: formatCurrency(data.summary.totalMaintenanceCost),
      expenses: formatCurrency(data.summary.totalExpenseCost),
      revenue: formatCurrency(data.summary.totalRevenue),
    },
  };
}
