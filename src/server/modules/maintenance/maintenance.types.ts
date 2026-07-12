import type { MaintenanceStatus, VehicleStatus } from "@/generated/prisma/enums";

export interface MaintenanceVehicleOption {
  id: string;
  registrationNumber: string;
  model: string;
  status: VehicleStatus;
}

export interface MaintenanceLogItem {
  id: string;
  vehicleId: string;
  vehicle: string;
  service: string;
  cost: number;
  status: MaintenanceStatus;
  startedAt: string;
  completedAt: string | null;
}

export interface MaintenanceOverview {
  vehicles: MaintenanceVehicleOption[];
  logs: MaintenanceLogItem[];
}

export interface CreateMaintenanceLogParams {
  vehicleId: string;
  service: string;
  cost: number;
  status: MaintenanceStatus;
  startedAt: Date;
  completedAt?: Date;
}
