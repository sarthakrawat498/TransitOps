import { TripStatus } from "@/generated/prisma/enums";
import type {
  ApiTripStatus,
  TripBoardItem,
  TripBoardViewData,
  TripDto,
  TripLifecycleStep,
  TripPaginationMeta,
  TripStatusTone,
} from "@/features/trips/types";

const tripStatusLabels: Record<ApiTripStatus, string> = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const tripStatusTones: Record<ApiTripStatus, TripStatusTone> = {
  DRAFT: "muted",
  DISPATCHED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const lifecycleOrder: ApiTripStatus[] = [
  TripStatus.DRAFT,
  TripStatus.DISPATCHED,
  TripStatus.COMPLETED,
  TripStatus.CANCELLED,
];

function formatDate(value: string | null): string {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatWeight(value: number) {
  return `${value.toLocaleString()} kg`;
}

function getPrimaryMeta(trip: TripDto): string {
  if (trip.status === TripStatus.DISPATCHED) {
    return `Dispatched ${formatDate(trip.dispatchedAt)}`;
  }

  if (trip.status === TripStatus.COMPLETED) {
    return `Completed ${formatDate(trip.completedAt)}`;
  }

  if (trip.status === TripStatus.CANCELLED) {
    return `Cancelled ${formatDate(trip.cancelledAt)}`;
  }

  return `Created ${formatDate(trip.createdAt)}`;
}

function getSecondaryMeta(trip: TripDto): string {
  if (trip.status === TripStatus.DRAFT) {
    return "Awaiting dispatch";
  }

  if (trip.status === TripStatus.CANCELLED) {
    return "Vehicle and driver released";
  }

  return `${formatWeight(trip.cargoWeight)} cargo`;
}

export function mapTripToBoardItem(trip: TripDto): TripBoardItem {
  return {
    id: trip.id,
    trip,
    displayId: `TR${trip.id.slice(0, 4).toUpperCase()}`,
    route: `${trip.source} -> ${trip.destination}`,
    vehicleLabel: `${trip.vehicle.registrationNumber} / ${trip.vehicle.type}`,
    driverName: trip.driver.fullName,
    status: trip.status,
    statusLabel: tripStatusLabels[trip.status],
    statusTone: tripStatusTones[trip.status],
    primaryMeta: getPrimaryMeta(trip),
    secondaryMeta: getSecondaryMeta(trip),
    canCancel: trip.status === TripStatus.DRAFT || trip.status === TripStatus.DISPATCHED,
    canDelete: trip.status === TripStatus.DRAFT,
    canDispatch: trip.status === TripStatus.DRAFT,
  };
}

export function mapTripsBoard(
  trips: TripDto[],
  pagination: TripPaginationMeta | undefined,
): TripBoardViewData {
  return {
    trips: trips.map(mapTripToBoardItem),
    pagination: pagination ?? {
      page: 1,
      pageSize: trips.length,
      total: trips.length,
      totalPages: trips.length > 0 ? 1 : 0,
    },
  };
}

export function getTripLifecycleSteps(activeStatus: ApiTripStatus): TripLifecycleStep[] {
  return lifecycleOrder.map((status) => ({
    id: status,
    label: tripStatusLabels[status],
    isActive: status === activeStatus,
  }));
}
