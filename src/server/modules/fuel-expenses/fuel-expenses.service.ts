import { ExpenseCategory } from "@/generated/prisma/enums";
import {
  FuelExpenseNotFoundError,
  FuelExpenseValidationError,
} from "@/server/modules/fuel-expenses/fuel-expenses.errors";
import * as fuelExpensesReader from "@/server/modules/fuel-expenses/fuel-expenses.reader";
import type {
  CreateExpenseParams,
  CreateFuelLogParams,
  FuelExpenseExpense,
  FuelExpenseFuelLog,
  FuelExpenseSummary,
  FuelExpenseTripOption,
  FuelExpenseVehicleOption,
  FuelExpensesOverview,
} from "@/server/modules/fuel-expenses/fuel-expenses.types";
import * as fuelExpensesWriter from "@/server/modules/fuel-expenses/fuel-expenses.writer";

type DecimalLike = {
  toNumber: () => number;
};

function decimalToNumber(value: DecimalLike | number | string): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value.toNumber();
}

function toDateString(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function formatTripLabel(trip: { source: string; destination: string; status: string }): string {
  return `${trip.source} to ${trip.destination} (${trip.status})`;
}

function mapVehicleOption(
  vehicle: Awaited<ReturnType<typeof fuelExpensesReader.getVehiclesForOptions>>[number],
): FuelExpenseVehicleOption {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registrationNumber,
    model: vehicle.model,
  };
}

function mapTripOption(
  trip: Awaited<ReturnType<typeof fuelExpensesReader.getTripsForOptions>>[number],
): FuelExpenseTripOption {
  return {
    id: trip.id,
    vehicleId: trip.vehicleId,
    label: formatTripLabel(trip),
  };
}

function mapFuelLog(
  fuelLog: Awaited<ReturnType<typeof fuelExpensesReader.getFuelLogs>>[number],
): FuelExpenseFuelLog {
  return {
    id: fuelLog.id,
    vehicleId: fuelLog.vehicleId,
    vehicle: fuelLog.vehicle.registrationNumber,
    tripId: fuelLog.tripId,
    trip: fuelLog.trip ? formatTripLabel(fuelLog.trip) : null,
    liters: decimalToNumber(fuelLog.liters),
    cost: decimalToNumber(fuelLog.cost),
    logDate: toDateString(fuelLog.logDate),
  };
}

function mapExpense(
  expense: Awaited<ReturnType<typeof fuelExpensesReader.getExpenses>>[number],
): FuelExpenseExpense {
  return {
    id: expense.id,
    vehicleId: expense.vehicleId,
    vehicle: expense.vehicle.registrationNumber,
    category: expense.category,
    amount: decimalToNumber(expense.amount),
    expenseDate: toDateString(expense.expenseDate),
    description: expense.description,
  };
}

function mapMaintenanceLogToExpense(
  maintenanceLog: Awaited<
    ReturnType<typeof fuelExpensesReader.getMaintenanceLogsForExpenses>
  >[number],
): FuelExpenseExpense {
  return {
    id: `maintenance-${maintenanceLog.id}`,
    vehicleId: maintenanceLog.vehicleId,
    vehicle: maintenanceLog.vehicle.registrationNumber,
    category: ExpenseCategory.MAINTENANCE,
    amount: decimalToNumber(maintenanceLog.cost),
    expenseDate: toDateString(maintenanceLog.startedAt),
    description: maintenanceLog.description,
  };
}

function sumBy<T>(items: T[], getValue: (item: T) => number): number {
  return items.reduce((total, item) => total + getValue(item), 0);
}

function buildSummary(
  fuelLogs: FuelExpenseFuelLog[],
  expenses: FuelExpenseExpense[],
): FuelExpenseSummary {
  const fuelCost = sumBy(fuelLogs, (fuelLog) => fuelLog.cost);
  const maintenanceCost = sumBy(
    expenses.filter((expense) => expense.category === ExpenseCategory.MAINTENANCE),
    (expense) => expense.amount,
  );
  const otherExpenseCost = sumBy(
    expenses.filter((expense) => expense.category !== ExpenseCategory.MAINTENANCE),
    (expense) => expense.amount,
  );

  return {
    fuelCost,
    maintenanceCost,
    otherExpenseCost,
    totalOperationalCost: fuelCost + maintenanceCost + otherExpenseCost,
  };
}

async function assertVehicleExists(vehicleId: string) {
  const vehicle = await fuelExpensesReader.getVehicleById(vehicleId);

  if (!vehicle) {
    throw new FuelExpenseNotFoundError("Vehicle not found");
  }
}

async function assertTripMatchesVehicle(tripId: string | undefined, vehicleId: string) {
  if (!tripId) {
    return;
  }

  const trip = await fuelExpensesReader.getTripById(tripId);

  if (!trip) {
    throw new FuelExpenseNotFoundError("Trip not found");
  }

  if (trip.vehicleId !== vehicleId) {
    throw new FuelExpenseValidationError("Selected trip does not belong to the selected vehicle");
  }
}

export async function getOverview(): Promise<FuelExpensesOverview> {
  const [fuelLogs, expenses, maintenanceLogs, vehicles, trips] = await Promise.all([
    fuelExpensesReader.getFuelLogs(),
    fuelExpensesReader.getExpenses(),
    fuelExpensesReader.getMaintenanceLogsForExpenses(),
    fuelExpensesReader.getVehiclesForOptions(),
    fuelExpensesReader.getTripsForOptions(),
  ]);

  const mappedFuelLogs = fuelLogs.map(mapFuelLog);
  const mappedExpenses = [
    ...maintenanceLogs.map(mapMaintenanceLogToExpense),
    ...expenses.map(mapExpense),
  ];

  return {
    fuelLogs: mappedFuelLogs,
    expenses: mappedExpenses,
    vehicles: vehicles.map(mapVehicleOption),
    trips: trips.map(mapTripOption),
    summary: buildSummary(mappedFuelLogs, mappedExpenses),
  };
}

export async function createFuelLog(params: CreateFuelLogParams): Promise<FuelExpenseFuelLog> {
  await assertVehicleExists(params.vehicleId);
  await assertTripMatchesVehicle(params.tripId, params.vehicleId);

  const fuelLog = await fuelExpensesWriter.createFuelLog(params);

  return mapFuelLog(fuelLog);
}

export async function createExpense(params: CreateExpenseParams): Promise<FuelExpenseExpense> {
  await assertVehicleExists(params.vehicleId);

  if (params.category === ExpenseCategory.MAINTENANCE) {
    throw new FuelExpenseValidationError("Maintenance expenses must be created from Maintenance");
  }

  const expense = await fuelExpensesWriter.createExpense(params);
  return mapExpense(expense);
}
