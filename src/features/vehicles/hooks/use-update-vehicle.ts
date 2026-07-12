"use client";

import { useMutation } from "@tanstack/react-query";

import * as vehiclesService from "@/features/vehicles/services/vehicles.service";
import type { UpdateVehicleInput } from "@/features/vehicles/schemas";

export function useUpdateVehicle() {
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVehicleInput }) =>
      vehiclesService.updateVehicle(id, input),
  });
}
