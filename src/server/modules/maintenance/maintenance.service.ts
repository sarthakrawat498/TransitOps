import { MaintenanceStatus } from "@/generated/prisma/enums";
import {
  MaintenanceNotFoundError,
  MaintenanceValidationError,
} from "@/server/modules/maintenance/maintenance.errors";
import * as maintenanceReader from "@/server/modules/maintenance/maintenance.reader";
import type {
  CreateMaintenanceLogParams,
  MaintenanceLogItem,
  MaintenanceOverview,
  MaintenanceVehicleOption,
} from "@/server/modules/maintenance/maintenance.types";
import * as maintenanceWriter from "@/server/modules/maintenance/maintenance.writer";

type DecimalLike = {
  toNumber: () => number;
};

function decimalToNumber(value: DecimalLike | number | string): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value.toNumber();
}

function toDateString(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function mapVehicleOption(
  vehicle: Awaited<ReturnType<typeof maintenanceReader.getVehiclesForOptions>>[number],
): MaintenanceVehicleOption {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registrationNumber,
    model: vehicle.model,
    status: vehicle.status,
  };
}

function mapMaintenanceLog(
  maintenanceLog: Awaited<ReturnType<typeof maintenanceReader.getMaintenanceLogs>>[number],
): MaintenanceLogItem {
  return {
    id: maintenanceLog.id,
    vehicleId: maintenanceLog.vehicleId,
    vehicle: maintenanceLog.vehicle.registrationNumber,
    service: maintenanceLog.description,
    cost: decimalToNumber(maintenanceLog.cost),
    status: maintenanceLog.status,
    startedAt: toDateString(maintenanceLog.startedAt),
    completedAt: maintenanceLog.completedAt ? toDateString(maintenanceLog.completedAt) : null,
  };
}

async function assertVehicleExists(vehicleId: string) {
  const vehicle = await maintenanceReader.getVehicleById(vehicleId);

  if (!vehicle) {
    throw new MaintenanceNotFoundError("Vehicle not found");
  }
}

export async function getOverview(): Promise<MaintenanceOverview> {
  const [vehicles, logs] = await Promise.all([
    maintenanceReader.getVehiclesForOptions(),
    maintenanceReader.getMaintenanceLogs(),
  ]);

  return {
    vehicles: vehicles.map(mapVehicleOption),
    logs: logs.map(mapMaintenanceLog),
  };
}

export async function createMaintenanceLog(
  params: CreateMaintenanceLogParams,
): Promise<MaintenanceLogItem> {
  await assertVehicleExists(params.vehicleId);

  if (params.completedAt && params.completedAt < params.startedAt) {
    throw new MaintenanceValidationError("Completed date cannot be before started date");
  }

  const completedAt =
    params.status === MaintenanceStatus.CLOSED
      ? (params.completedAt ?? params.startedAt)
      : undefined;

  const maintenanceLog = await maintenanceWriter.createMaintenanceLog({
    ...params,
    completedAt,
  });

  return mapMaintenanceLog(maintenanceLog);
}
