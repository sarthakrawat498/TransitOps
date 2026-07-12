import type { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/enums";

export interface TripListFilters {
  status?: TripStatus;
  vehicleId?: string;
  driverId?: string;
  source?: string;
  destination?: string;
  page: number;
  pageSize: number;
}

export interface TripCreateParams {
  vehicleId: string;
  driverId: string;
  createdById: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  revenue?: number;
}

export interface TripUpdateParams {
  vehicleId?: string;
  driverId?: string;
  source?: string;
  destination?: string;
  cargoWeight?: number;
  plannedDistance?: number;
  revenue?: number | null;
}

export interface TripVehicleSummary {
  id: string;
  registrationNumber: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  status: VehicleStatus;
  region: string | null;
}

export interface TripDriverSummary {
  id: string;
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}

export interface TripCreatorSummary {
  id: string;
  fullName: string;
  email: string;
}

export interface TripDto {
  id: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  actualDistance: number | null;
  revenue: number | null;
  status: TripStatus;
  finalOdometer: number | null;
  dispatchedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle: TripVehicleSummary;
  driver: TripDriverSummary;
  createdBy: TripCreatorSummary;
}

export interface TripListResult {
  trips: TripDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface TripOptions {
  vehicles: TripVehicleSummary[];
  drivers: TripDriverSummary[];
}
