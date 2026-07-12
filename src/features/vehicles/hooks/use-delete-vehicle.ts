"use client";

import { useMutation } from "@tanstack/react-query";

import * as vehiclesService from "@/features/vehicles/services/vehicles.service";

export function useDeleteVehicle() {
  return useMutation({
    mutationFn: (id: string) => vehiclesService.deleteVehicle(id),
  });
}
