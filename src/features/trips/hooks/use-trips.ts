"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateTripInput, UpdateTripInput } from "@/features/trips/schemas";
import { mapTripsBoard } from "@/features/trips/services/trips.mappers";
import * as tripsService from "@/features/trips/services/trips.service";
import type { TripListQueryParams, TripPaginationMeta } from "@/features/trips/types";

const tripsQueryKey = ["trips"] as const;

function toPaginationMeta(
  meta: Record<string, unknown> | undefined,
): TripPaginationMeta | undefined {
  if (!meta) {
    return undefined;
  }

  return {
    page: Number(meta.page ?? 1),
    pageSize: Number(meta.pageSize ?? 0),
    total: Number(meta.total ?? 0),
    totalPages: Number(meta.totalPages ?? 0),
  };
}

export function useTrips(params: TripListQueryParams = {}) {
  return useQuery({
    queryKey: [...tripsQueryKey, "list", params],
    queryFn: async () => {
      const response = await tripsService.getTrips(params);

      if (!response.data) {
        throw new Error("Trips response did not include data.");
      }

      return mapTripsBoard(response.data.trips, toPaginationMeta(response.meta));
    },
  });
}

export function useTripOptions() {
  return useQuery({
    queryKey: [...tripsQueryKey, "options"],
    queryFn: async () => {
      const response = await tripsService.getTripOptions();

      if (!response.data) {
        throw new Error("Trip options response did not include data.");
      }

      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTripInput) => tripsService.createTrip(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tripsQueryKey });
    },
  });
}

export function useCreateAndDispatchTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTripInput) => tripsService.createAndDispatchTrip(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tripsQueryKey });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTripInput }) =>
      tripsService.updateTrip(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tripsQueryKey });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tripsService.deleteTrip(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tripsQueryKey });
    },
  });
}

export function useDispatchTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tripsService.dispatchTrip(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tripsQueryKey });
    },
  });
}

export function useCancelTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tripsService.cancelTrip(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tripsQueryKey });
    },
  });
}
