import { ExpenseCategory, MaintenanceStatus, VehicleStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { CreateMaintenanceLogParams } from "@/server/modules/maintenance/maintenance.types";

const vehicleSelect = {
  id: true,
  registrationNumber: true,
  model: true,
  status: true,
} as const;

const maintenanceLogSelect = {
  id: true,
  vehicleId: true,
  description: true,
  cost: true,
  status: true,
  startedAt: true,
  completedAt: true,
  vehicle: {
    select: {
      registrationNumber: true,
    },
  },
} as const;

function getVehicleStatusForMaintenance(status: MaintenanceStatus): VehicleStatus {
  return status === MaintenanceStatus.OPEN ? VehicleStatus.IN_SHOP : VehicleStatus.AVAILABLE;
}

export async function findVehiclesForOptions() {
  return prisma.vehicle.findMany({
    orderBy: { registrationNumber: "asc" },
    select: vehicleSelect,
  });
}

export async function findMaintenanceLogs() {
  return prisma.maintenanceLog.findMany({
    orderBy: [{ startedAt: "desc" }, { createdAt: "desc" }],
    select: maintenanceLogSelect,
  });
}

export async function findVehicleById(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function createMaintenanceLogWithExpense(params: CreateMaintenanceLogParams) {
  return prisma.$transaction(async (tx) => {
    const maintenanceLog = await tx.maintenanceLog.create({
      data: {
        vehicleId: params.vehicleId,
        description: params.service,
        cost: params.cost,
        status: params.status,
        startedAt: params.startedAt,
        completedAt: params.completedAt,
      },
      select: maintenanceLogSelect,
    });

    await tx.expense.create({
      data: {
        vehicleId: params.vehicleId,
        category: ExpenseCategory.MAINTENANCE,
        amount: params.cost,
        expenseDate: params.startedAt,
        description: `Maintenance: ${params.service}`,
      },
    });

    await tx.vehicle.update({
      where: { id: params.vehicleId },
      data: { status: getVehicleStatusForMaintenance(params.status) },
    });

    return maintenanceLog;
  });
}
