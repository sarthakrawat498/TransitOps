import axios from "axios";

import type { CreateVehicleInput, UpdateVehicleInput, ListVehiclesInput } from "@/features/vehicles/schemas";
import type { ApiSuccessResponse } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
  region: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclesListResponse {
  vehicles: Vehicle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getVehicles(params?: Partial<ListVehiclesInput>) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.type) searchParams.set("type", params.type);
  if (params?.region) searchParams.set("region", params.region);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const url = query ? `/vehicles?${query}` : "/vehicles";

  const { data } = await api.get<ApiSuccessResponse<VehiclesListResponse>>(url);
  return data;
}

export async function getVehicle(id: string) {
  const { data } = await api.get<ApiSuccessResponse<{ vehicle: Vehicle }>>(`/vehicles/${id}`);
  return data;
}

export async function createVehicle(input: CreateVehicleInput) {
  const { data } = await api.post<ApiSuccessResponse<{ vehicle: Vehicle }>>("/vehicles", input);
  return data;
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  const { data } = await api.patch<ApiSuccessResponse<{ vehicle: Vehicle }>>(`/vehicles/${id}`, input);
  return data;
}

export async function deleteVehicle(id: string) {
  const { data } = await api.delete<ApiSuccessResponse>(`/vehicles/${id}`);
  return data;
}

export async function getAvailableVehicles() {
  const { data } = await api.get<ApiSuccessResponse<{ vehicles: Vehicle[] }>>("/vehicles/available");
  return data;
}
