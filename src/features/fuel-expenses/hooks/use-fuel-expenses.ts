"use client";

import { useQuery } from "@tanstack/react-query";

import { fuelExpensesQueryKeys } from "@/features/fuel-expenses/hooks/query-keys";
import { getFuelExpensesOverview } from "@/features/fuel-expenses/services/fuel-expenses.service";

export function useFuelExpenses() {
  return useQuery({
    queryKey: fuelExpensesQueryKeys.overview,
    queryFn: async () => {
      const response = await getFuelExpensesOverview();

      if (!response.data) {
        throw new Error("Fuel and expense response did not include data.");
      }

      return response.data;
    },
  });
}
