import { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/enums";
import * as dashboardReader from "@/server/modules/dashboard/dashboard.reader";
import type {
  DashboardFilters,
  DashboardOverview,
  DashboardOverviewFilters,
  DashboardRecentTrip,
  DashboardVehicleStatusItem,
} from "@/server/modules/dashboard/dashboard.types";

function percentage(part: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function getVehicleScope(filters: DashboardOverviewFilters) {
  return {
    vehicleType: filters.vehicleType,
    region: filters.region,
  };
}

function mapRecentTrip(
  trip: Awaited<ReturnType<typeof dashboardReader.getRecentTrips>>[number],
): DashboardRecentTrip {
  return {
    id: trip.id,
    source: trip.source,
    destination: trip.destination,
    status: trip.status,
    dispatchedAt: toIsoString(trip.dispatchedAt),
    completedAt: toIsoString(trip.completedAt),
    createdAt: trip.createdAt.toISOString(),
    vehicle: {
      id: trip.vehicle.id,
      registrationNumber: trip.vehicle.registrationNumber,
      type: trip.vehicle.type,
      status: trip.vehicle.status,
      region: trip.vehicle.region,
    },
    driver: {
      id: trip.driver.id,
      fullName: trip.driver.fullName,
      status: trip.driver.status,
    },
  };
}

function mapVehicleStatusGroups(
  groups: Awaited<ReturnType<typeof dashboardReader.getVehicleStatusGroups>>,
  totalVehicles: number,
): DashboardVehicleStatusItem[] {
  const countByStatus = new Map(groups.map((group) => [group.status, group._count._all]));

  return Object.values(VehicleStatus).map((status) => {
    const count = countByStatus.get(status) ?? 0;

    return {
      status,
      count,
      percentage: percentage(count, totalVehicles),
    };
  });
}

export async function getOverview(filters: DashboardOverviewFilters): Promise<DashboardOverview> {
  const vehicleScope = getVehicleScope(filters);
  const vehicleStatusScope = {
    ...vehicleScope,
    vehicleStatus: filters.vehicleStatus,
  };

  const [
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    vehiclesOnTrip,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    totalVehiclesForStatus,
    vehicleStatusGroups,
    recentTrips,
  ] = await Promise.all([
    dashboardReader.getVehicleCount({
      ...vehicleScope,
      excludedVehicleStatus: VehicleStatus.RETIRED,
    }),
    dashboardReader.getVehicleCount({
      ...vehicleScope,
      vehicleStatus: VehicleStatus.AVAILABLE,
    }),
    dashboardReader.getVehicleCount({
      ...vehicleScope,
      vehicleStatus: VehicleStatus.IN_SHOP,
    }),
    dashboardReader.getVehicleCount({
      ...vehicleScope,
      vehicleStatus: VehicleStatus.ON_TRIP,
    }),
    dashboardReader.getTripCount({
      ...vehicleScope,
      tripStatus: TripStatus.DISPATCHED,
    }),
    dashboardReader.getTripCount({
      ...vehicleScope,
      tripStatus: TripStatus.DRAFT,
    }),
    dashboardReader.getDriverCount({
      driverStatuses: [DriverStatus.AVAILABLE, DriverStatus.ON_TRIP],
    }),
    dashboardReader.getVehicleCount(vehicleStatusScope),
    dashboardReader.getVehicleStatusGroups(vehicleStatusScope),
    dashboardReader.getRecentTrips(
      {
        ...vehicleStatusScope,
        tripStatus: filters.tripStatus,
      },
      filters.recentTripsLimit,
    ),
  ]);

  return {
    summary: {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilizationPercent: percentage(vehiclesOnTrip, activeVehicles),
    },
    recentTrips: recentTrips.map(mapRecentTrip),
    vehicleStatus: mapVehicleStatusGroups(vehicleStatusGroups, totalVehiclesForStatus),
  };
}

export async function getFilters(): Promise<DashboardFilters> {
  const [vehicleTypes, regions] = await Promise.all([
    dashboardReader.getVehicleTypes(),
    dashboardReader.getVehicleRegions(),
  ]);

  return {
    vehicleTypes: vehicleTypes.map((vehicle) => vehicle.type),
    regions: regions
      .map((vehicle) => vehicle.region)
      .filter((region): region is string => Boolean(region)),
    vehicleStatuses: Object.values(VehicleStatus),
    tripStatuses: Object.values(TripStatus),
    driverStatuses: Object.values(DriverStatus),
  };
}
