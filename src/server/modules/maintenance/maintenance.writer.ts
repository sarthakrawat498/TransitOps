import type { CreateMaintenanceLogParams } from "@/server/modules/maintenance/maintenance.types";
import * as maintenanceRepository from "@/server/modules/maintenance/maintenance.repository";

export async function createMaintenanceLog(params: CreateMaintenanceLogParams) {
  return maintenanceRepository.createMaintenanceLogWithExpense(params);
}
