"use client";

import { useQuery } from "@tanstack/react-query";

import { mapAnalyticsOverview } from "@/features/analytics/services/analytics.mappers";
import { getAnalyticsOverview } from "@/features/analytics/services/analytics.service";
import type { AnalyticsOverviewQueryParams } from "@/features/analytics/types";

export function useAnalyticsOverview(params: AnalyticsOverviewQueryParams) {
  return useQuery({
    queryKey: ["analytics", "overview", params],
    queryFn: async () => {
      const response = await getAnalyticsOverview(params);

      if (!response.data) {
        throw new Error("Analytics overview response did not include data.");
      }

      return mapAnalyticsOverview(response.data);
    },
  });
}
