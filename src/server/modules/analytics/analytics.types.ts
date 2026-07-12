import type { ExpenseCategory, VehicleStatus } from "@/generated/prisma/enums";

export interface AnalyticsOverviewFilters {
  startDate?: Date;
  endDate?: Date;
  vehicleType?: string;
  region?: string;
  vehicleId?: string;
}

export interface AnalyticsDateRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsSummary {
  fuelEfficiencyKmPerLiter: number;
  fleetUtilizationPercent: number;
  operationalCost: number;
  vehicleRoiPercent: number;
  totalRevenue: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalExpenseCost: number;
  completedTrips: number;
  activeVehicles: number;
}

export interface AnalyticsMonthlySeriesItem {
  month: string;
  label: string;
  revenue: number;
  fuelCost: number;
  maintenanceCost: number;
  expenseCost: number;
  operationalCost: number;
}

export interface AnalyticsVehicleCostItem {
  vehicleId: string;
  registrationNumber: string;
  status: VehicleStatus;
  totalCost: number;
  fuelCost: number;
  maintenanceCost: number;
  expenseCost: number;
  revenue: number;
  roiPercent: number;
}

export interface AnalyticsExpenseCategoryItem {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface AnalyticsOverview {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: AnalyticsSummary;
  monthlySeries: AnalyticsMonthlySeriesItem[];
  topCostliestVehicles: AnalyticsVehicleCostItem[];
  expenseBreakdown: AnalyticsExpenseCategoryItem[];
}

export interface AnalyticsFilterVehicle {
  id: string;
  registrationNumber: string;
}

export interface AnalyticsFilters {
  vehicleTypes: string[];
  regions: string[];
  vehicles: AnalyticsFilterVehicle[];
}
