import type { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/enums";

export interface DashboardOverviewFilters {
  vehicleType?: string;
  vehicleStatus?: VehicleStatus;
  region?: string;
  tripStatus?: TripStatus;
  recentTripsLimit: number;
}

export interface DashboardSummary {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilizationPercent: number;
}

export interface DashboardVehicleStatusItem {
  status: VehicleStatus;
  count: number;
  percentage: number;
}

export interface DashboardRecentTrip {
  id: string;
  source: string;
  destination: string;
  status: TripStatus;
  dispatchedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  vehicle: {
    id: string;
    registrationNumber: string;
    type: string;
    status: VehicleStatus;
    region: string | null;
  };
  driver: {
    id: string;
    fullName: string;
    status: DriverStatus;
  };
}

export interface DashboardOverview {
  summary: DashboardSummary;
  recentTrips: DashboardRecentTrip[];
  vehicleStatus: DashboardVehicleStatusItem[];
}

export interface DashboardFilters {
  vehicleTypes: string[];
  regions: string[];
  vehicleStatuses: VehicleStatus[];
  tripStatuses: TripStatus[];
  driverStatuses: DriverStatus[];
}
