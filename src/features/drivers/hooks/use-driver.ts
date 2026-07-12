"use client";

import { useQuery } from "@tanstack/react-query";

import * as driversService from "@/features/drivers/services/drivers.service";

export function useDriver(id: string) {
  return useQuery({
    queryKey: ["drivers", id],
    queryFn: () => driversService.getDriver(id),
    enabled: !!id,
  });
}
