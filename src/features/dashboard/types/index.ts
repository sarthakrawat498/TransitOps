import type {
  DashboardFilters as DashboardFiltersResponseData,
  DashboardOverview as DashboardOverviewResponseData,
  DashboardVehicleStatusItem as ApiVehicleStatusSegment,
} from "@/server/modules/dashboard/dashboard.types";
import type { TripStatus as ApiTripStatus } from "@/generated/prisma/enums";

export interface DashboardOverviewQueryParams {
  vehicleType?: string;
  vehicleStatus?: string;
  region?: string;
  tripStatus?: string;
  recentTripsLimit?: number;
}

export type {
  ApiTripStatus,
  ApiVehicleStatusSegment,
  DashboardFiltersResponseData,
  DashboardOverviewResponseData,
};

export type DashboardFilterKey = "vehicleType" | "vehicleStatus" | "region" | "tripStatus";

export type DashboardFilterValues = Record<DashboardFilterKey, string>;

export interface DashboardFilterOption {
  label: string;
  value: string;
}

export interface DashboardFilter {
  key: DashboardFilterKey;
  label: string;
  options: DashboardFilterOption[];
}

export type DashboardMetricTone = "blue" | "green" | "orange";

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  tone: DashboardMetricTone;
}

export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";

export interface RecentTrip {
  id: string;
  route: string;
  vehicle: string;
  driver: string;
  status: TripStatus;
  timeline: string;
}

export interface VehicleStatusSegment {
  id: string;
  label: string;
  count: number;
  percentage: number;
  colorClassName: string;
}

export interface DashboardOverviewViewData {
  metrics: DashboardMetric[];
  recentTrips: RecentTrip[];
  vehicleStatus: VehicleStatusSegment[];
}
