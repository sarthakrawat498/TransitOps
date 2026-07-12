"use client";

import { useQuery } from "@tanstack/react-query";

import * as vehiclesService from "@/features/vehicles/services/vehicles.service";

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => vehiclesService.getVehicle(id),
    enabled: !!id,
  });
}
