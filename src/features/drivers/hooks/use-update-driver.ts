"use client";

import { useMutation } from "@tanstack/react-query";

import * as driversService from "@/features/drivers/services/drivers.service";
import type { UpdateDriverInput } from "@/features/drivers/schemas";

export function useUpdateDriver() {
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDriverInput }) =>
      driversService.updateDriver(id, input),
  });
}
