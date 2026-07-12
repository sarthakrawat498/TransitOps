import { prisma } from "@/lib/prisma";
import type { VehicleStatus } from "@/generated/prisma/enums";
import type { VehicleRecord } from "./vehicles.types";

function mapToRecord(vehicle: {
  id: string;
  registrationNumber: string;
  model: string;
  type: string;
  maxLoadCapacity: unknown;
  odometer: unknown;
  acquisitionCost: unknown;
  status: VehicleStatus;
  region: string | null;
  createdAt: Date;
  updatedAt: Date;
}): VehicleRecord {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registrationNumber,
    model: vehicle.model,
    type: vehicle.type,
    maxLoadCapacity: Number(vehicle.maxLoadCapacity),
    odometer: Number(vehicle.odometer),
    acquisitionCost: Number(vehicle.acquisitionCost),
    status: vehicle.status,
    region: vehicle.region,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
}

export async function findVehicleById(id: string): Promise<VehicleRecord | null> {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  return vehicle ? mapToRecord(vehicle) : null;
}

export async function findVehicleByRegistration(registrationNumber: string): Promise<VehicleRecord | null> {
  const vehicle = await prisma.vehicle.findUnique({ where: { registrationNumber } });
  return vehicle ? mapToRecord(vehicle) : null;
}

export async function findAllVehicles(filters: {
  status?: VehicleStatus;
  type?: string;
  region?: string;
  skip: number;
  take: number;
}): Promise<{ vehicles: VehicleRecord[]; total: number }> {
  const where = {
    ...(filters.status && { status: filters.status }),
    ...(filters.type && { type: filters.type }),
    ...(filters.region && { region: filters.region }),
  };

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip: filters.skip,
      take: filters.take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.vehicle.count({ where }),
  ]);

  return {
    vehicles: vehicles.map(mapToRecord),
    total,
  };
}

export async function findAvailableVehicles(): Promise<VehicleRecord[]> {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { registrationNumber: "asc" },
  });
  return vehicles.map(mapToRecord);
}

export async function createVehicleRecord(data: {
  registrationNumber: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region?: string;
}): Promise<VehicleRecord> {
  const vehicle = await prisma.vehicle.create({
    data: {
      registrationNumber: data.registrationNumber,
      model: data.model,
      type: data.type,
      maxLoadCapacity: data.maxLoadCapacity,
      odometer: data.odometer,
      acquisitionCost: data.acquisitionCost,
      status: data.status,
      region: data.region,
    },
  });
  return mapToRecord(vehicle);
}

export async function updateVehicleRecord(
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
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data,
  });
  return mapToRecord(vehicle);
}

export async function deleteVehicleRecord(id: string): Promise<void> {
  await prisma.vehicle.delete({ where: { id } });
}

export async function countVehicleTrips(id: string): Promise<number> {
  return prisma.trip.count({ where: { vehicleId: id } });
}
