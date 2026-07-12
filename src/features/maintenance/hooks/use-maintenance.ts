"use client";

import { useQuery } from "@tanstack/react-query";

import { maintenanceQueryKeys } from "@/features/maintenance/hooks/query-keys";
import { getMaintenanceOverview } from "@/features/maintenance/services/maintenance.service";

export function useMaintenance() {
  return useQuery({
    queryKey: maintenanceQueryKeys.overview,
    queryFn: async () => {
      const response = await getMaintenanceOverview();

      if (!response.data) {
        throw new Error("Maintenance response did not include data.");
      }

      return response.data;
    },
  });
}
