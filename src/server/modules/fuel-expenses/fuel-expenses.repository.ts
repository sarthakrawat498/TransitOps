import { prisma } from "@/lib/prisma";
import type {
  CreateExpenseParams,
  CreateFuelLogParams,
} from "@/server/modules/fuel-expenses/fuel-expenses.types";

const vehicleOptionSelect = {
  id: true,
  registrationNumber: true,
  model: true,
} as const;

const tripOptionSelect = {
  id: true,
  vehicleId: true,
  source: true,
  destination: true,
  status: true,
} as const;

const fuelLogSelect = {
  id: true,
  vehicleId: true,
  tripId: true,
  liters: true,
  cost: true,
  logDate: true,
  vehicle: {
    select: {
      registrationNumber: true,
    },
  },
  trip: {
    select: {
      source: true,
      destination: true,
      status: true,
    },
  },
} as const;

const expenseSelect = {
  id: true,
  vehicleId: true,
  category: true,
  amount: true,
  expenseDate: true,
  description: true,
  vehicle: {
    select: {
      registrationNumber: true,
    },
  },
} as const;

const maintenanceLogSelect = {
  id: true,
  vehicleId: true,
  description: true,
  cost: true,
  startedAt: true,
  vehicle: {
    select: {
      registrationNumber: true,
    },
  },
} as const;

export async function findVehiclesForOptions() {
  return prisma.vehicle.findMany({
    orderBy: { registrationNumber: "asc" },
    select: vehicleOptionSelect,
  });
}

export async function findTripsForOptions() {
  return prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    select: tripOptionSelect,
  });
}

export async function findFuelLogs() {
  return prisma.fuelLog.findMany({
    orderBy: [{ logDate: "desc" }, { createdAt: "desc" }],
    select: fuelLogSelect,
  });
}

export async function findExpenses() {
  return prisma.expense.findMany({
    where: {
      category: {
        not: "MAINTENANCE",
      },
    },
    orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
    select: expenseSelect,
  });
}

export async function findMaintenanceLogsForExpenses() {
  return prisma.maintenanceLog.findMany({
    orderBy: [{ startedAt: "desc" }, { createdAt: "desc" }],
    select: maintenanceLogSelect,
  });
}

export async function findVehicleById(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    select: { id: true },
  });
}

export async function findTripById(id: string) {
  return prisma.trip.findUnique({
    where: { id },
    select: {
      id: true,
      vehicleId: true,
    },
  });
}

export async function createFuelLog(params: CreateFuelLogParams) {
  return prisma.fuelLog.create({
    data: {
      vehicleId: params.vehicleId,
      tripId: params.tripId,
      liters: params.liters,
      cost: params.cost,
      logDate: params.logDate,
    },
    select: fuelLogSelect,
  });
}

export async function createExpense(params: CreateExpenseParams) {
  return prisma.expense.create({
    data: {
      vehicleId: params.vehicleId,
      category: params.category,
      amount: params.amount,
      expenseDate: params.expenseDate,
      description: params.description,
    },
    select: expenseSelect,
  });
}
