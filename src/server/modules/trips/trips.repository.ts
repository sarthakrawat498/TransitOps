import type { Prisma } from "@/generated/prisma/client";
import { DriverStatus, VehicleStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { TripListFilters } from "@/server/modules/trips/trips.types";

type TripsRepositoryClient = Pick<typeof prisma, "driver" | "trip" | "vehicle">;

export const tripDetailSelect = {
  id: true,
  source: true,
  destination: true,
  cargoWeight: true,
  plannedDistance: true,
  actualDistance: true,
  revenue: true,
  status: true,
  finalOdometer: true,
  dispatchedAt: true,
  completedAt: true,
  cancelledAt: true,
  createdAt: true,
  updatedAt: true,
  vehicle: {
    select: {
      id: true,
      registrationNumber: true,
      model: true,
      type: true,
      maxLoadCapacity: true,
      odometer: true,
      status: true,
      region: true,
    },
  },
  driver: {
    select: {
      id: true,
      fullName: true,
      licenseNumber: true,
      licenseCategory: true,
      licenseExpiry: true,
      contactNumber: true,
      safetyScore: true,
      status: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
} satisfies Prisma.TripSelect;

export const vehicleOptionSelect = {
  id: true,
  registrationNumber: true,
  model: true,
  type: true,
  maxLoadCapacity: true,
  odometer: true,
  status: true,
  region: true,
} satisfies Prisma.VehicleSelect;

export const driverOptionSelect = {
  id: true,
  fullName: true,
  licenseNumber: true,
  licenseCategory: true,
  licenseExpiry: true,
  contactNumber: true,
  safetyScore: true,
  status: true,
} satisfies Prisma.DriverSelect;

function buildTripWhere(filters: TripListFilters): Prisma.TripWhereInput {
  const where: Prisma.TripWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.vehicleId) {
    where.vehicleId = filters.vehicleId;
  }

  if (filters.driverId) {
    where.driverId = filters.driverId;
  }

  if (filters.source) {
    where.source = { contains: filters.source };
  }

  if (filters.destination) {
    where.destination = { contains: filters.destination };
  }

  return where;
}

export async function countTrips(filters: TripListFilters) {
  return prisma.trip.count({ where: buildTripWhere(filters) });
}

export async function findTrips(filters: TripListFilters) {
  return prisma.trip.findMany({
    where: buildTripWhere(filters),
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    skip: (filters.page - 1) * filters.pageSize,
    take: filters.pageSize,
    select: tripDetailSelect,
  });
}

export async function findTripById(id: string, client: TripsRepositoryClient = prisma) {
  return client.trip.findUnique({
    where: { id },
    select: tripDetailSelect,
  });
}

export async function createTrip(
  data: Prisma.TripUncheckedCreateInput,
  client: TripsRepositoryClient = prisma,
) {
  return client.trip.create({
    data,
    select: tripDetailSelect,
  });
}

export async function updateTrip(
  id: string,
  data: Prisma.TripUncheckedUpdateInput,
  client: TripsRepositoryClient = prisma,
) {
  return client.trip.update({
    where: { id },
    data,
    select: tripDetailSelect,
  });
}

export async function deleteTrip(id: string, client: TripsRepositoryClient = prisma) {
  return client.trip.delete({
    where: { id },
    select: tripDetailSelect,
  });
}

export async function findVehicleById(id: string, client: TripsRepositoryClient = prisma) {
  return client.vehicle.findUnique({
    where: { id },
    select: vehicleOptionSelect,
  });
}

export async function findDriverById(id: string, client: TripsRepositoryClient = prisma) {
  return client.driver.findUnique({
    where: { id },
    select: driverOptionSelect,
  });
}

export async function findAvailableVehicles() {
  return prisma.vehicle.findMany({
    where: { status: VehicleStatus.AVAILABLE },
    orderBy: [{ registrationNumber: "asc" }],
    select: vehicleOptionSelect,
  });
}

export async function findAvailableDrivers() {
  return prisma.driver.findMany({
    where: { status: DriverStatus.AVAILABLE },
    orderBy: [{ fullName: "asc" }],
    select: driverOptionSelect,
  });
}

export async function updateVehicleStatus(
  id: string,
  status: VehicleStatus,
  client: TripsRepositoryClient = prisma,
) {
  return client.vehicle.update({
    where: { id },
    data: { status },
    select: vehicleOptionSelect,
  });
}

export async function updateDriverStatus(
  id: string,
  status: DriverStatus,
  client: TripsRepositoryClient = prisma,
) {
  return client.driver.update({
    where: { id },
    data: { status },
    select: driverOptionSelect,
  });
}
