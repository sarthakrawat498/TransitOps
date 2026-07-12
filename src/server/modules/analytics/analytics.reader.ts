import type {
  AnalyticsScopedFilters,
  AnalyticsVehicleFilters,
} from "@/server/modules/analytics/analytics.repository";
import * as analyticsRepository from "@/server/modules/analytics/analytics.repository";

export async function getVehiclesForAnalytics(filters: AnalyticsVehicleFilters = {}) {
  return analyticsRepository.findVehiclesForAnalytics(filters);
}

export async function getVehicleCount(filters: AnalyticsVehicleFilters = {}) {
  return analyticsRepository.countVehicles(filters);
}

export async function getCompletedRevenueTrips(filters: AnalyticsScopedFilters) {
  return analyticsRepository.findCompletedRevenueTrips(filters);
}

export async function getFuelLogs(filters: AnalyticsScopedFilters) {
  return analyticsRepository.findFuelLogs(filters);
}

export async function getMaintenanceLogs(filters: AnalyticsScopedFilters) {
  return analyticsRepository.findMaintenanceLogs(filters);
}

export async function getExpenses(filters: AnalyticsScopedFilters) {
  return analyticsRepository.findExpenses(filters);
}

export async function getVehicleTypes() {
  return analyticsRepository.findVehicleTypes();
}

export async function getVehicleRegions() {
  return analyticsRepository.findVehicleRegions();
}

export async function getFilterVehicles() {
  return analyticsRepository.findFilterVehicles();
}
