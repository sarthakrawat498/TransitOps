"use client";

import { useMutation } from "@tanstack/react-query";

import * as vehiclesService from "@/features/vehicles/services/vehicles.service";
import type { CreateVehicleInput } from "@/features/vehicles/schemas";

export function useCreateVehicle() {
  return useMutation({
    mutationFn: (input: CreateVehicleInput) => vehiclesService.createVehicle(input),
  });
}
