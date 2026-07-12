"use client";

import { useQuery } from "@tanstack/react-query";

import { mapDashboardOverview } from "@/features/dashboard/services/dashboard.mappers";
import { getDashboardOverview } from "@/features/dashboard/services/dashboard.service";
import type { DashboardOverviewQueryParams } from "@/features/dashboard/types";

export function useDashboardOverview(params: DashboardOverviewQueryParams) {
  return useQuery({
    queryKey: ["dashboard", "overview", params],
    queryFn: async () => {
      const response = await getDashboardOverview(params);

      if (!response.data) {
        throw new Error("Dashboard overview response did not include data.");
      }

      return mapDashboardOverview(response.data);
    },
  });
}
