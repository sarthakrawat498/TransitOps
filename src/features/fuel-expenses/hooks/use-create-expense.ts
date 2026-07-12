"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fuelExpensesQueryKeys } from "@/features/fuel-expenses/hooks/query-keys";
import { createExpense } from "@/features/fuel-expenses/services/fuel-expenses.service";
import type { CreateExpenseInput } from "@/features/fuel-expenses/types";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExpenseInput) => createExpense(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: fuelExpensesQueryKeys.overview });
    },
  });
}
