import axios from "axios";

import type { CreateDriverInput, UpdateDriverInput, ListDriversInput } from "@/features/drivers/schemas";
import type { ApiSuccessResponse } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Driver {
  id: string;
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  contactNumber: string;
  safetyScore: number;
  status: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export interface DriversListResponse {
  drivers: Driver[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getDrivers(params?: Partial<ListDriversInput>) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const url = query ? `/drivers?${query}` : "/drivers";

  const { data } = await api.get<ApiSuccessResponse<DriversListResponse>>(url);
  return data;
}

export async function getDriver(id: string) {
  const { data } = await api.get<ApiSuccessResponse<{ driver: Driver }>>(`/drivers/${id}`);
  return data;
}

export async function createDriver(input: CreateDriverInput) {
  const { data } = await api.post<ApiSuccessResponse<{ driver: Driver }>>("/drivers", input);
  return data;
}

export async function updateDriver(id: string, input: UpdateDriverInput) {
  const { data } = await api.patch<ApiSuccessResponse<{ driver: Driver }>>(`/drivers/${id}`, input);
  return data;
}

export async function deleteDriver(id: string) {
  const { data } = await api.delete<ApiSuccessResponse>(`/drivers/${id}`);
  return data;
}

export async function getAvailableDrivers() {
  const { data } = await api.get<ApiSuccessResponse<{ drivers: Driver[] }>>("/drivers/available");
  return data;
}
