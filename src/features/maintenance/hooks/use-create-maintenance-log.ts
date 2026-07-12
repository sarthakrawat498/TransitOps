"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { maintenanceQueryKeys } from "@/features/maintenance/hooks/query-keys";
import { createMaintenanceLog } from "@/features/maintenance/services/maintenance.service";
import type { CreateMaintenanceLogInput } from "@/features/maintenance/types";

export function useCreateMaintenanceLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMaintenanceLogInput) => createMaintenanceLog(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.overview });
      await queryClient.invalidateQueries({ queryKey: ["fuel-expenses", "overview"] });
    },
  });
}
