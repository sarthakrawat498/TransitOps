import type {
  ApiTripStatus,
  ApiVehicleStatusSegment,
  DashboardFilter,
  DashboardFiltersResponseData,
  DashboardMetric,
  DashboardOverviewResponseData,
  DashboardOverviewViewData,
  RecentTrip,
  TripStatus,
  VehicleStatusSegment,
} from "@/features/dashboard/types";

const tripStatusLabels: Record<ApiTripStatus, TripStatus> = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const vehicleStatusColors: Record<string, string> = {
  AVAILABLE: "bg-emerald-500",
  ON_TRIP: "bg-sky-400",
  IN_SHOP: "bg-amber-500",
  MAINTENANCE: "bg-amber-500",
  RETIRED: "bg-rose-400",
};

function humanizeValue(value: string) {
  return value
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function withAllOption(values: string[]) {
  return [
    { label: "All", value: "all" },
    ...values.map((value) => ({
      label: humanizeValue(value),
      value,
    })),
  ];
}

function formatMetricValue(value: number, suffix = "") {
  return `${value}${suffix}`;
}

function mapMetrics(data: DashboardOverviewResponseData): DashboardMetric[] {
  const { summary } = data;

  return [
    {
      id: "active-vehicles",
      label: "Active Vehicles",
      value: formatMetricValue(summary.activeVehicles),
      tone: "blue",
    },
    {
      id: "available-vehicles",
      label: "Available Vehicles",
      value: formatMetricValue(summary.availableVehicles),
      tone: "green",
    },
    {
      id: "maintenance",
      label: "Vehicles In Maintenance",
      value: formatMetricValue(summary.vehiclesInMaintenance),
      tone: "orange",
    },
    {
      id: "active-trips",
      label: "Active Trips",
      value: formatMetricValue(summary.activeTrips),
      tone: "blue",
    },
    {
      id: "pending-trips",
      label: "Pending Trips",
      value: formatMetricValue(summary.pendingTrips),
      tone: "blue",
    },
    {
      id: "drivers-duty",
      label: "Drivers On Duty",
      value: formatMetricValue(summary.driversOnDuty),
      tone: "blue",
    },
    {
      id: "fleet-utilization",
      label: "Fleet Utilization",
      value: formatMetricValue(summary.fleetUtilizationPercent, "%"),
      tone: "green",
    },
  ];
}

function mapTimeline(trip: DashboardOverviewResponseData["recentTrips"][number]) {
  if (trip.completedAt) {
    return `Completed ${new Date(trip.completedAt).toLocaleDateString()}`;
  }

  if (trip.dispatchedAt) {
    return `Dispatched ${new Date(trip.dispatchedAt).toLocaleDateString()}`;
  }

  return `Created ${new Date(trip.createdAt).toLocaleDateString()}`;
}

function mapRecentTrips(data: DashboardOverviewResponseData): RecentTrip[] {
  return data.recentTrips.map((trip) => ({
    id: trip.id,
    route: `${trip.source} -> ${trip.destination}`,
    vehicle: trip.vehicle.registrationNumber,
    driver: trip.driver.fullName,
    status: tripStatusLabels[trip.status],
    timeline: mapTimeline(trip),
  }));
}

function mapVehicleStatusSegment(segment: ApiVehicleStatusSegment): VehicleStatusSegment {
  const normalizedStatus = segment.status.toUpperCase();

  return {
    id: normalizedStatus.toLowerCase().replaceAll("_", "-"),
    label: humanizeValue(segment.status),
    count: segment.count,
    percentage: segment.percentage,
    colorClassName: vehicleStatusColors[normalizedStatus] ?? "bg-slate-400",
  };
}

export function mapDashboardFilters(data: DashboardFiltersResponseData): DashboardFilter[] {
  return [
    {
      key: "vehicleType",
      label: "Vehicle Type",
      options: withAllOption(data.vehicleTypes),
    },
    {
      key: "vehicleStatus",
      label: "Vehicle Status",
      options: withAllOption(data.vehicleStatuses),
    },
    {
      key: "region",
      label: "Region",
      options: withAllOption(data.regions),
    },
    {
      key: "tripStatus",
      label: "Trip Status",
      options: withAllOption(data.tripStatuses),
    },
  ];
}

export function mapDashboardOverview(
  data: DashboardOverviewResponseData,
): DashboardOverviewViewData {
  return {
    metrics: mapMetrics(data),
    recentTrips: mapRecentTrips(data),
    vehicleStatus: data.vehicleStatus.map(mapVehicleStatusSegment),
  };
}
