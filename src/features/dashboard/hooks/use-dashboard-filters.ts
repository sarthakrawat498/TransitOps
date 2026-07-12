"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardFilters } from "@/features/dashboard/services/dashboard.service";
import { mapDashboardFilters } from "@/features/dashboard/services/dashboard.mappers";

export function useDashboardFilters() {
  return useQuery({
    queryKey: ["dashboard", "filters"],
    queryFn: async () => {
      const response = await getDashboardFilters();

      if (!response.data) {
        throw new Error("Dashboard filters response did not include data.");
      }

      return mapDashboardFilters(response.data);
    },
    staleTime: 5 * 60 * 1000,
  });
}
