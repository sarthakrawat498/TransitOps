import type { VehicleStatus } from "@/generated/prisma/enums";
import type { VehicleRecord } from "./vehicles.types";
import * as vehiclesRepository from "./vehicles.repository";

export async function getVehicleById(id: string): Promise<VehicleRecord | null> {
  return vehiclesRepository.findVehicleById(id);
}

export async function getVehicleByRegistration(registrationNumber: string): Promise<VehicleRecord | null> {
  return vehiclesRepository.findVehicleByRegistration(registrationNumber);
}

export async function getVehicles(filters: {
  status?: VehicleStatus;
  type?: string;
  region?: string;
  skip: number;
  take: number;
}): Promise<{ vehicles: VehicleRecord[]; total: number }> {
  return vehiclesRepository.findAllVehicles(filters);
}

export async function getAvailableVehicles(): Promise<VehicleRecord[]> {
  return vehiclesRepository.findAvailableVehicles();
}

export async function getVehicleTripCount(id: string): Promise<number> {
  return vehiclesRepository.countVehicleTrips(id);
}
