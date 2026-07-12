import type { VehicleStatus } from "@/generated/prisma/enums";
import type { VehicleRecord } from "./vehicles.types";
import * as vehiclesRepository from "./vehicles.repository";

export async function createVehicle(data: {
  registrationNumber: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region?: string;
}): Promise<VehicleRecord> {
  return vehiclesRepository.createVehicleRecord(data);
}

export async function updateVehicle(
  id: string,
  data: {
    model?: string;
    type?: string;
    maxLoadCapacity?: number;
    odometer?: number;
    acquisitionCost?: number;
    status?: VehicleStatus;
    region?: string | null;
  }
): Promise<VehicleRecord> {
  return vehiclesRepository.updateVehicleRecord(id, data);
}

export async function deleteVehicle(id: string): Promise<void> {
  return vehiclesRepository.deleteVehicleRecord(id);
}
