"use client";

import { useQuery } from "@tanstack/react-query";

import { mapAnalyticsFilters } from "@/features/analytics/services/analytics.mappers";
import { getAnalyticsFilters } from "@/features/analytics/services/analytics.service";

export function useAnalyticsFilters() {
  return useQuery({
    queryKey: ["analytics", "filters"],
    queryFn: async () => {
      const response = await getAnalyticsFilters();

      if (!response.data) {
        throw new Error("Analytics filters response did not include data.");
      }

      return mapAnalyticsFilters(response.data);
    },
  });
}
