"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fuelExpensesQueryKeys } from "@/features/fuel-expenses/hooks/query-keys";
import { createFuelLog } from "@/features/fuel-expenses/services/fuel-expenses.service";
import type { CreateFuelLogInput } from "@/features/fuel-expenses/types";

export function useCreateFuelLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFuelLogInput) => createFuelLog(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: fuelExpensesQueryKeys.overview });
    },
  });
}
