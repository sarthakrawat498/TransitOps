import * as maintenanceRepository from "@/server/modules/maintenance/maintenance.repository";

export async function getVehiclesForOptions() {
  return maintenanceRepository.findVehiclesForOptions();
}

export async function getMaintenanceLogs() {
  return maintenanceRepository.findMaintenanceLogs();
}

export async function getVehicleById(id: string) {
  return maintenanceRepository.findVehicleById(id);
}
