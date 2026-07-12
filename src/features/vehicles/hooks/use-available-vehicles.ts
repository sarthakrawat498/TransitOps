"use client";

import { useQuery } from "@tanstack/react-query";

import * as vehiclesService from "@/features/vehicles/services/vehicles.service";

export function useAvailableVehicles() {
  return useQuery({
    queryKey: ["vehicles", "available"],
    queryFn: () => vehiclesService.getAvailableVehicles(),
  });
}
