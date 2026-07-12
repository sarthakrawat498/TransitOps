"use client";

import { useMutation } from "@tanstack/react-query";

import * as driversService from "@/features/drivers/services/drivers.service";
import type { CreateDriverInput } from "@/features/drivers/schemas";

export function useCreateDriver() {
  return useMutation({
    mutationFn: (input: CreateDriverInput) => driversService.createDriver(input),
  });
}
