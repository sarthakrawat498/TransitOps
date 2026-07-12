"use client";

import { useQuery } from "@tanstack/react-query";

import * as vehiclesService from "@/features/vehicles/services/vehicles.service";
import type { ListVehiclesInput } from "@/features/vehicles/schemas";

export function useVehicles(params?: Partial<ListVehiclesInput>) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => vehiclesService.getVehicles(params),
  });
}
