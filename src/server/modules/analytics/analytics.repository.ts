import type { Prisma } from "@/generated/prisma/client";
import { TripStatus, VehicleStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { AnalyticsDateRange } from "@/server/modules/analytics/analytics.types";

export interface AnalyticsVehicleFilters {
  vehicleType?: string;
  region?: string;
  vehicleId?: string;
  vehicleStatus?: VehicleStatus;
  excludedVehicleStatus?: VehicleStatus;
}

export interface AnalyticsScopedFilters extends AnalyticsVehicleFilters, AnalyticsDateRange {}

function buildDateWhere(range: AnalyticsDateRange) {
  return {
    gte: range.startDate,
    lte: range.endDate,
  };
}

function buildVehicleWhere(filters: AnalyticsVehicleFilters): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = {};

  if (filters.vehicleId) {
    where.id = filters.vehicleId;
  }

  if (filters.vehicleType) {
    where.type = filters.vehicleType;
  }

  if (filters.region) {
    where.region = filters.region;
  }

  if (filters.vehicleStatus) {
    where.status = filters.vehicleStatus;
  } else if (filters.excludedVehicleStatus) {
    where.status = { not: filters.excludedVehicleStatus };
  }

  return where;
}

function buildVehicleRelationWhere(filters: AnalyticsVehicleFilters) {
  const vehicleWhere = buildVehicleWhere(filters);

  if (Object.keys(vehicleWhere).length === 0) {
    return undefined;
  }

  return { is: vehicleWhere };
}

export async function findVehiclesForAnalytics(filters: AnalyticsVehicleFilters = {}) {
  return prisma.vehicle.findMany({
    where: buildVehicleWhere({
      ...filters,
      excludedVehicleStatus: filters.excludedVehicleStatus ?? VehicleStatus.RETIRED,
    }),
    orderBy: { registrationNumber: "asc" },
    select: {
      id: true,
      registrationNumber: true,
      status: true,
      acquisitionCost: true,
    },
  });
}

export async function countVehicles(filters: AnalyticsVehicleFilters = {}) {
  return prisma.vehicle.count({ where: buildVehicleWhere(filters) });
}

export async function findCompletedRevenueTrips(filters: AnalyticsScopedFilters) {
  return prisma.trip.findMany({
    where: {
      status: TripStatus.COMPLETED,
      completedAt: buildDateWhere(filters),
      vehicle: buildVehicleRelationWhere(filters),
    },
    select: {
      id: true,
      vehicleId: true,
      revenue: true,
      plannedDistance: true,
      actualDistance: true,
      completedAt: true,
    },
  });
}

export async function findFuelLogs(filters: AnalyticsScopedFilters) {
  return prisma.fuelLog.findMany({
    where: {
      logDate: buildDateWhere(filters),
      vehicle: buildVehicleRelationWhere(filters),
    },
    select: {
      id: true,
      vehicleId: true,
      liters: true,
      cost: true,
      logDate: true,
    },
  });
}

export async function findMaintenanceLogs(filters: AnalyticsScopedFilters) {
  return prisma.maintenanceLog.findMany({
    where: {
      startedAt: buildDateWhere(filters),
      vehicle: buildVehicleRelationWhere(filters),
    },
    select: {
      id: true,
      vehicleId: true,
      cost: true,
      startedAt: true,
    },
  });
}

export async function findExpenses(filters: AnalyticsScopedFilters) {
  return prisma.expense.findMany({
    where: {
      expenseDate: buildDateWhere(filters),
      vehicle: buildVehicleRelationWhere(filters),
    },
    select: {
      id: true,
      vehicleId: true,
      category: true,
      amount: true,
      expenseDate: true,
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

export async function findFilterVehicles() {
  return prisma.vehicle.findMany({
    where: { status: { not: VehicleStatus.RETIRED } },
    orderBy: { registrationNumber: "asc" },
    select: {
      id: true,
      registrationNumber: true,
    },
  });
}
