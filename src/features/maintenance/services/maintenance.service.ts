import axios from "axios";

import type {
  CreateMaintenanceLogInput,
  MaintenanceLogItem,
  MaintenanceOverview,
} from "@/features/maintenance/types";
import type { ApiSuccessResponse } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getMaintenanceOverview() {
  const { data } = await api.get<ApiSuccessResponse<MaintenanceOverview>>("/maintenance");

  return data;
}

export async function createMaintenanceLog(input: CreateMaintenanceLogInput) {
  const { data } = await api.post<ApiSuccessResponse<{ maintenanceLog: MaintenanceLogItem }>>(
    "/maintenance/logs",
    input,
  );

  return data;
}
