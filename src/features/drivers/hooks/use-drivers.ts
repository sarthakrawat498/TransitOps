"use client";

import { useQuery } from "@tanstack/react-query";

import * as driversService from "@/features/drivers/services/drivers.service";
import type { ListDriversInput } from "@/features/drivers/schemas";

export function useDrivers(params?: Partial<ListDriversInput>) {
  return useQuery({
    queryKey: ["drivers", params],
    queryFn: () => driversService.getDrivers(params),
  });
}
