import axios from "axios";

import type { CreateTripInput, UpdateTripInput } from "@/features/trips/schemas";
import type { TripDto, TripListQueryParams, TripOptions } from "@/features/trips/types";
import type { ApiSuccessResponse } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function buildListParams(params: TripListQueryParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null || value === "") {
        return false;
      }

      return value !== "all";
    }),
  );
}

export async function getTrips(params: TripListQueryParams = {}) {
  const { data } = await api.get<ApiSuccessResponse<{ trips: TripDto[] }>>("/trips", {
    params: buildListParams(params),
  });

  return data;
}

export async function getTripOptions() {
  const { data } = await api.get<ApiSuccessResponse<TripOptions>>("/trips/options");
  return data;
}

export async function createTrip(input: CreateTripInput) {
  const { data } = await api.post<ApiSuccessResponse<{ trip: TripDto }>>("/trips", input);
  return data;
}

export async function createAndDispatchTrip(input: CreateTripInput) {
  const { data } = await api.post<ApiSuccessResponse<{ trip: TripDto }>>("/trips/dispatch", input);
  return data;
}

export async function updateTrip(id: string, input: UpdateTripInput) {
  const { data } = await api.patch<ApiSuccessResponse<{ trip: TripDto }>>(`/trips/${id}`, input);
  return data;
}

export async function deleteTrip(id: string) {
  const { data } = await api.delete<ApiSuccessResponse<{ trip: TripDto }>>(`/trips/${id}`);
  return data;
}

export async function dispatchTrip(id: string) {
  const { data } = await api.post<ApiSuccessResponse<{ trip: TripDto }>>(`/trips/${id}/dispatch`);
  return data;
}

export async function cancelTrip(id: string) {
  const { data } = await api.post<ApiSuccessResponse<{ trip: TripDto }>>(`/trips/${id}/cancel`);
  return data;
}
