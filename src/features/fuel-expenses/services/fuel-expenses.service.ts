import axios from "axios";

import type {
  CreateExpenseInput,
  CreateFuelLogInput,
  FuelExpenseExpense,
  FuelExpenseFuelLog,
  FuelExpensesOverview,
} from "@/features/fuel-expenses/types";
import type { ApiSuccessResponse } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getFuelExpensesOverview() {
  const { data } = await api.get<ApiSuccessResponse<FuelExpensesOverview>>("/fuel-expenses");

  return data;
}

export async function createFuelLog(input: CreateFuelLogInput) {
  const { data } = await api.post<ApiSuccessResponse<{ fuelLog: FuelExpenseFuelLog }>>(
    "/fuel-expenses/fuel-logs",
    input,
  );

  return data;
}

export async function createExpense(input: CreateExpenseInput) {
  const { data } = await api.post<ApiSuccessResponse<{ expense: FuelExpenseExpense }>>(
    "/fuel-expenses/expenses",
    input,
  );

  return data;
}
