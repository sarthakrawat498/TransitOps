import type { VehicleStatus } from "@/generated/prisma/enums";

export interface VehicleRecord {
  id: string;
  registrationNumber: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleParams {
  registrationNumber: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer?: number;
  acquisitionCost: number;
  status?: VehicleStatus;
  region?: string;
}

export interface UpdateVehicleParams {
  model?: string;
  type?: string;
  maxLoadCapacity?: number;
  odometer?: number;
  acquisitionCost?: number;
  status?: VehicleStatus;
  region?: string | null;
}

export interface VehicleListParams {
  status?: VehicleStatus;
  type?: string;
  region?: string;
  page?: number;
  limit?: number;
}

export interface VehicleListResult {
  vehicles: VehicleRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
