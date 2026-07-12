"use client";

import { useMutation } from "@tanstack/react-query";

import * as driversService from "@/features/drivers/services/drivers.service";

export function useDeleteDriver() {
  return useMutation({
    mutationFn: (id: string) => driversService.deleteDriver(id),
  });
}
