import type { VehicleStatus } from "@/generated/prisma/enums";
import {
  VehicleNotFoundError,
  DuplicateRegistrationError,
  VehicleHasActiveTripsError,
} from "./vehicles.errors";
import * as vehiclesReader from "./vehicles.reader";
import * as vehiclesWriter from "./vehicles.writer";
import type {
  VehicleRecord,
  CreateVehicleParams,
  UpdateVehicleParams,
  VehicleListParams,
  VehicleListResult,
} from "./vehicles.types";

export async function listVehicles(params: VehicleListParams): Promise<VehicleListResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const skip = (page - 1) * limit;

  const { vehicles, total } = await vehiclesReader.getVehicles({
    status: params.status,
    type: params.type,
    region: params.region,
    skip,
    take: limit,
  });

  return {
    vehicles,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getVehicle(id: string): Promise<VehicleRecord> {
  const vehicle = await vehiclesReader.getVehicleById(id);
  if (!vehicle) {
    throw new VehicleNotFoundError();
  }
  return vehicle;
}

export async function createVehicle(params: CreateVehicleParams): Promise<VehicleRecord> {
  const existing = await vehiclesReader.getVehicleByRegistration(params.registrationNumber);
  if (existing) {
    throw new DuplicateRegistrationError();
  }

  return vehiclesWriter.createVehicle({
    registrationNumber: params.registrationNumber,
    model: params.model,
    type: params.type,
    maxLoadCapacity: params.maxLoadCapacity,
    odometer: params.odometer ?? 0,
    acquisitionCost: params.acquisitionCost,
    status: params.status ?? ("AVAILABLE" as VehicleStatus),
    region: params.region,
  });
}

export async function updateVehicle(id: string, params: UpdateVehicleParams): Promise<VehicleRecord> {
  const existing = await vehiclesReader.getVehicleById(id);
  if (!existing) {
    throw new VehicleNotFoundError();
  }

  return vehiclesWriter.updateVehicle(id, params);
}

export async function deleteVehicle(id: string): Promise<void> {
  const existing = await vehiclesReader.getVehicleById(id);
  if (!existing) {
    throw new VehicleNotFoundError();
  }

  const tripCount = await vehiclesReader.getVehicleTripCount(id);
  if (tripCount > 0) {
    throw new VehicleHasActiveTripsError();
  }

  await vehiclesWriter.deleteVehicle(id);
}

export async function getAvailableVehicles(): Promise<VehicleRecord[]> {
  return vehiclesReader.getAvailableVehicles();
}
