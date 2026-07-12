import type {
  DashboardDriverFilters,
  DashboardTripFilters,
  DashboardVehicleFilters,
} from "@/server/modules/dashboard/dashboard.repository";
import * as dashboardRepository from "@/server/modules/dashboard/dashboard.repository";

export async function getVehicleCount(filters: DashboardVehicleFilters = {}) {
  return dashboardRepository.countVehicles(filters);
}

export async function getTripCount(filters: DashboardTripFilters = {}) {
  return dashboardRepository.countTrips(filters);
}

export async function getDriverCount(filters: DashboardDriverFilters = {}) {
  return dashboardRepository.countDrivers(filters);
}

export async function getVehicleStatusGroups(filters: DashboardVehicleFilters = {}) {
  return dashboardRepository.groupVehiclesByStatus(filters);
}

export async function getRecentTrips(filters: DashboardTripFilters, limit: number) {
  return dashboardRepository.findRecentTrips(filters, limit);
}

export async function getVehicleTypes() {
  return dashboardRepository.findVehicleTypes();
}

export async function getVehicleRegions() {
  return dashboardRepository.findVehicleRegions();
}
