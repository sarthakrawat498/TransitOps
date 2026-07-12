import type { Prisma } from "@/generated/prisma/client";
import type { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export interface DashboardVehicleFilters {
  vehicleType?: string;
  vehicleStatus?: VehicleStatus;
  vehicleStatuses?: VehicleStatus[];
  excludedVehicleStatus?: VehicleStatus;
  region?: string;
}

export interface DashboardTripFilters extends DashboardVehicleFilters {
  tripStatus?: TripStatus;
  tripStatuses?: TripStatus[];
}

export interface DashboardDriverFilters {
  driverStatuses?: DriverStatus[];
}

function buildVehicleWhere(filters: DashboardVehicleFilters): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = {};

  if (filters.vehicleType) {
    where.type = filters.vehicleType;
  }

  if (filters.region) {
    where.region = filters.region;
  }

  if (filters.vehicleStatuses) {
    where.status = { in: filters.vehicleStatuses };
  } else if (filters.vehicleStatus) {
    where.status = filters.vehicleStatus;
  } else if (filters.excludedVehicleStatus) {
    where.status = { not: filters.excludedVehicleStatus };
  }

  return where;
}

function buildTripWhere(filters: DashboardTripFilters): Prisma.TripWhereInput {
  const where: Prisma.TripWhereInput = {};
  const vehicleWhere = buildVehicleWhere(filters);

  if (filters.tripStatuses) {
    where.status = { in: filters.tripStatuses };
  } else if (filters.tripStatus) {
    where.status = filters.tripStatus;
  }

  if (Object.keys(vehicleWhere).length > 0) {
    where.vehicle = { is: vehicleWhere };
  }

  return where;
}

function buildDriverWhere(filters: DashboardDriverFilters): Prisma.DriverWhereInput {
  const where: Prisma.DriverWhereInput = {};

  if (filters.driverStatuses) {
    where.status = { in: filters.driverStatuses };
  }

  return where;
}

export async function countVehicles(filters: DashboardVehicleFilters = {}) {
  return prisma.vehicle.count({ where: buildVehicleWhere(filters) });
}

export async function countTrips(filters: DashboardTripFilters = {}) {
  return prisma.trip.count({ where: buildTripWhere(filters) });
}

export async function countDrivers(filters: DashboardDriverFilters = {}) {
  return prisma.driver.count({ where: buildDriverWhere(filters) });
}

export async function groupVehiclesByStatus(filters: DashboardVehicleFilters = {}) {
  return prisma.vehicle.groupBy({
    by: ["status"],
    where: buildVehicleWhere(filters),
    _count: {
      _all: true,
    },
  });
}

export async function findRecentTrips(filters: DashboardTripFilters, limit: number) {
  return prisma.trip.findMany({
    where: buildTripWhere(filters),
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      source: true,
      destination: true,
      status: true,
      dispatchedAt: true,
      completedAt: true,
      createdAt: true,
      vehicle: {
        select: {
          id: true,
          registrationNumber: true,
          type: true,
          status: true,
          region: true,
        },
      },
      driver: {
        select: {
          id: true,
          fullName: true,
          status: true,
        },
      },
    },
  });
}

export async function findVehicleTypes() {
  return prisma.vehicle.findMany({
    distinct: ["type"],
    orderBy: { type: "asc" },
    select: { type: true },
  });
}

export async function findVehicleRegions() {
  return prisma.vehicle.findMany({
    distinct: ["region"],
    where: { region: { not: null } },
    orderBy: { region: "asc" },
    select: { region: true },
  });
}
