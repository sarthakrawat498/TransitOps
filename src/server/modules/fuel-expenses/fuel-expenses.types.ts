import type { ExpenseCategory } from "@/generated/prisma/enums";

export interface FuelExpenseVehicleOption {
  id: string;
  registrationNumber: string;
  model: string;
}

export interface FuelExpenseTripOption {
  id: string;
  vehicleId: string;
  label: string;
}

export interface FuelExpenseFuelLog {
  id: string;
  vehicleId: string;
  vehicle: string;
  tripId: string | null;
  trip: string | null;
  liters: number;
  cost: number;
  logDate: string;
}

export interface FuelExpenseExpense {
  id: string;
  vehicleId: string;
  vehicle: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  description: string | null;
}

export interface FuelExpenseSummary {
  fuelCost: number;
  maintenanceCost: number;
  otherExpenseCost: number;
  totalOperationalCost: number;
}

export interface FuelExpensesOverview {
  fuelLogs: FuelExpenseFuelLog[];
  expenses: FuelExpenseExpense[];
  vehicles: FuelExpenseVehicleOption[];
  trips: FuelExpenseTripOption[];
  summary: FuelExpenseSummary;
}

export interface CreateFuelLogParams {
  vehicleId: string;
  tripId?: string;
  liters: number;
  cost: number;
  logDate: Date;
}

export interface CreateExpenseParams {
  vehicleId: string;
  description?: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: Date;
}
