import type {
  CreateExpenseParams,
  CreateFuelLogParams,
} from "@/server/modules/fuel-expenses/fuel-expenses.types";
import * as fuelExpensesRepository from "@/server/modules/fuel-expenses/fuel-expenses.repository";

export async function createFuelLog(params: CreateFuelLogParams) {
  return fuelExpensesRepository.createFuelLog(params);
}

export async function createExpense(params: CreateExpenseParams) {
  return fuelExpensesRepository.createExpense(params);
}
