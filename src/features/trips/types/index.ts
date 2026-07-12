import type { TripStatus as ApiTripStatus } from "@/generated/prisma/enums";
import type { TripDto, TripListResult, TripOptions } from "@/server/modules/trips/trips.types";

export type { ApiTripStatus, TripDto, TripListResult, TripOptions };

export interface TripListQueryParams {
  status?: string;
  vehicleId?: string;
  driverId?: string;
  source?: string;
  destination?: string;
  page?: number;
  pageSize?: number;
}

export interface TripPaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type TripStatusTone = "muted" | "info" | "success" | "danger";

export interface TripBoardItem {
  id: string;
  trip: TripDto;
  displayId: string;
  route: string;
  vehicleLabel: string;
  driverName: string;
  status: ApiTripStatus;
  statusLabel: string;
  statusTone: TripStatusTone;
  primaryMeta: string;
  secondaryMeta: string;
  canCancel: boolean;
  canDelete: boolean;
  canDispatch: boolean;
}

export interface TripLifecycleStep {
  id: ApiTripStatus;
  label: string;
  isActive: boolean;
}

export interface TripBoardViewData {
  trips: TripBoardItem[];
  pagination: TripPaginationMeta;
}
