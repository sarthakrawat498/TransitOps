import * as fuelExpensesRepository from "@/server/modules/fuel-expenses/fuel-expenses.repository";

export async function getVehiclesForOptions() {
  return fuelExpensesRepository.findVehiclesForOptions();
}

export async function getTripsForOptions() {
  return fuelExpensesRepository.findTripsForOptions();
}

export async function getFuelLogs() {
  return fuelExpensesRepository.findFuelLogs();
}

export async function getExpenses() {
  return fuelExpensesRepository.findExpenses();
}

export async function getMaintenanceLogsForExpenses() {
  return fuelExpensesRepository.findMaintenanceLogsForExpenses();
}

export async function getVehicleById(id: string) {
  return fuelExpensesRepository.findVehicleById(id);
}

export async function getTripById(id: string) {
  return fuelExpensesRepository.findTripById(id);
}
