import { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { TripCreateParams, TripUpdateParams } from "@/server/modules/trips/trips.types";
import * as tripsRepository from "@/server/modules/trips/trips.repository";

function buildTripCreateData(params: TripCreateParams) {
  return {
    vehicleId: params.vehicleId,
    driverId: params.driverId,
    createdById: params.createdById,
    source: params.source,
    destination: params.destination,
    cargoWeight: params.cargoWeight,
    plannedDistance: params.plannedDistance,
    revenue: params.revenue ?? null,
  };
}

function buildTripUpdateData(params: TripUpdateParams) {
  return Object.fromEntries(
    Object.entries({
      vehicleId: params.vehicleId,
      driverId: params.driverId,
      source: params.source,
      destination: params.destination,
      cargoWeight: params.cargoWeight,
      plannedDistance: params.plannedDistance,
      revenue: params.revenue,
    }).filter(([, value]) => value !== undefined),
  );
}

export async function createDraftTrip(params: TripCreateParams) {
  return tripsRepository.createTrip({
    ...buildTripCreateData(params),
    status: TripStatus.DRAFT,
  });
}

export async function updateDraftTrip(id: string, params: TripUpdateParams) {
  return tripsRepository.updateTrip(id, buildTripUpdateData(params));
}

export async function deleteDraftTrip(id: string) {
  return tripsRepository.deleteTrip(id);
}

export async function dispatchTrip(id: string, vehicleId: string, driverId: string) {
  return prisma.$transaction(async (tx) => {
    await tripsRepository.updateVehicleStatus(vehicleId, VehicleStatus.ON_TRIP, tx);
    await tripsRepository.updateDriverStatus(driverId, DriverStatus.ON_TRIP, tx);

    return tripsRepository.updateTrip(
      id,
      {
        status: TripStatus.DISPATCHED,
        dispatchedAt: new Date(),
        cancelledAt: null,
      },
      tx,
    );
  });
}

export async function createAndDispatchTrip(params: TripCreateParams) {
  return prisma.$transaction(async (tx) => {
    await tripsRepository.updateVehicleStatus(params.vehicleId, VehicleStatus.ON_TRIP, tx);
    await tripsRepository.updateDriverStatus(params.driverId, DriverStatus.ON_TRIP, tx);

    const trip = await tripsRepository.createTrip(
      {
        ...buildTripCreateData(params),
        status: TripStatus.DISPATCHED,
        dispatchedAt: new Date(),
      },
      tx,
    );

    return trip;
  });
}

export async function cancelTrip(
  id: string,
  vehicleId: string,
  driverId: string,
  wasDispatched: boolean,
) {
  return prisma.$transaction(async (tx) => {
    if (wasDispatched) {
      await tripsRepository.updateVehicleStatus(vehicleId, VehicleStatus.AVAILABLE, tx);
      await tripsRepository.updateDriverStatus(driverId, DriverStatus.AVAILABLE, tx);
    }

    return tripsRepository.updateTrip(
      id,
      {
        status: TripStatus.CANCELLED,
        cancelledAt: new Date(),
      },
      tx,
    );
  });
}
