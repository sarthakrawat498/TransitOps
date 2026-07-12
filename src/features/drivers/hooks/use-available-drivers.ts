"use client";

import { useQuery } from "@tanstack/react-query";

import * as driversService from "@/features/drivers/services/drivers.service";

export function useAvailableDrivers() {
  return useQuery({
    queryKey: ["drivers", "available"],
    queryFn: () => driversService.getAvailableDrivers(),
  });
}
