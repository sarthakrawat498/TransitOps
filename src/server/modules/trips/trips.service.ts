import { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/enums";
import {
  TripAssignmentUnavailableError,
  TripNotFoundError,
  TripOperationNotAllowedError,
} from "@/server/modules/trips/trips.errors";
import * as tripsReader from "@/server/modules/trips/trips.reader";
import type {
  TripCreateParams,
  TripDto,
  TripDriverSummary,
  TripListFilters,
  TripListResult,
  TripOptions,
  TripUpdateParams,
  TripVehicleSummary,
} from "@/server/modules/trips/trips.types";
import * as tripsWriter from "@/server/modules/trips/trips.writer";

type TripRecord = NonNullable<Awaited<ReturnType<typeof tripsReader.getTripById>>>;
type VehicleRecord = NonNullable<Awaited<ReturnType<typeof tripsReader.getVehicleById>>>;
type DriverRecord = NonNullable<Awaited<ReturnType<typeof tripsReader.getDriverById>>>;

function toNumber(value: unknown): number {
  return Number(value);
}

function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function toDateOnlyIsoString(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function mapVehicle(vehicle: VehicleRecord): TripVehicleSummary {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registrationNumber,
    model: vehicle.model,
    type: vehicle.type,
    maxLoadCapacity: toNumber(vehicle.maxLoadCapacity),
    odometer: toNumber(vehicle.odometer),
    status: vehicle.status,
    region: vehicle.region,
  };
}

function mapDriver(driver: DriverRecord): TripDriverSummary {
  return {
    id: driver.id,
    fullName: driver.fullName,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiry: toDateOnlyIsoString(driver.licenseExpiry),
    contactNumber: driver.contactNumber,
    safetyScore: driver.safetyScore,
    status: driver.status,
  };
}

function mapTrip(trip: TripRecord): TripDto {
  return {
    id: trip.id,
    source: trip.source,
    destination: trip.destination,
    cargoWeight: toNumber(trip.cargoWeight),
    plannedDistance: toNumber(trip.plannedDistance),
    actualDistance: trip.actualDistance === null ? null : toNumber(trip.actualDistance),
    revenue: trip.revenue === null ? null : toNumber(trip.revenue),
    status: trip.status,
    finalOdometer: trip.finalOdometer === null ? null : toNumber(trip.finalOdometer),
    dispatchedAt: toIsoString(trip.dispatchedAt),
    completedAt: toIsoString(trip.completedAt),
    cancelledAt: toIsoString(trip.cancelledAt),
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
    vehicle: mapVehicle(trip.vehicle),
    driver: mapDriver(trip.driver),
    createdBy: {
      id: trip.createdBy.id,
      fullName: trip.createdBy.fullName,
      email: trip.createdBy.email,
    },
  };
}

function assertDraftTrip(trip: TripRecord, action: string) {
  if (trip.status !== TripStatus.DRAFT) {
    throw new TripOperationNotAllowedError(`Only draft trips can be ${action}`);
  }
}

function assertNotExpired(driver: DriverRecord) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (driver.licenseExpiry < today) {
    throw new TripAssignmentUnavailableError("Driver license has expired");
  }
}

function assertCapacity(vehicle: VehicleRecord, cargoWeight: number) {
  if (cargoWeight > toNumber(vehicle.maxLoadCapacity)) {
    throw new TripAssignmentUnavailableError("Cargo weight exceeds vehicle capacity");
  }
}

async function getRequiredTrip(id: string): Promise<TripRecord> {
  const trip = await tripsReader.getTripById(id);
  if (!trip) {
    throw new TripNotFoundError();
  }

  return trip;
}

async function getRequiredVehicle(id: string): Promise<VehicleRecord> {
  const vehicle = await tripsReader.getVehicleById(id);
  if (!vehicle) {
    throw new TripAssignmentUnavailableError("Vehicle not found");
  }

  return vehicle;
}

async function getRequiredDriver(id: string): Promise<DriverRecord> {
  const driver = await tripsReader.getDriverById(id);
  if (!driver) {
    throw new TripAssignmentUnavailableError("Driver not found");
  }

  return driver;
}

async function assertDispatchableAssignment(params: {
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
}) {
  const [vehicle, driver] = await Promise.all([
    getRequiredVehicle(params.vehicleId),
    getRequiredDriver(params.driverId),
  ]);

  if (vehicle.status !== VehicleStatus.AVAILABLE) {
    throw new TripAssignmentUnavailableError("Vehicle is not available for dispatch");
  }

  if (driver.status !== DriverStatus.AVAILABLE) {
    throw new TripAssignmentUnavailableError("Driver is not available for dispatch");
  }

  assertNotExpired(driver);
  assertCapacity(vehicle, params.cargoWeight);
}

async function assertDraftAssignment(params: {
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
}) {
  const [vehicle, driver] = await Promise.all([
    getRequiredVehicle(params.vehicleId),
    getRequiredDriver(params.driverId),
  ]);

  assertCapacity(vehicle, params.cargoWeight);

  return { vehicle, driver };
}

export async function listTrips(filters: TripListFilters): Promise<TripListResult> {
  const [trips, total] = await Promise.all([
    tripsReader.getTrips(filters),
    tripsReader.getTripCount(filters),
  ]);

  return {
    trips: trips.map(mapTrip),
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      total,
      totalPages: Math.ceil(total / filters.pageSize),
    },
  };
}

export async function getTrip(id: string): Promise<TripDto> {
  return mapTrip(await getRequiredTrip(id));
}

export async function getOptions(): Promise<TripOptions> {
  const [vehicles, drivers] = await Promise.all([
    tripsReader.getAvailableVehicles(),
    tripsReader.getAvailableDrivers(),
  ]);

  return {
    vehicles: vehicles.map(mapVehicle),
    drivers: drivers.map(mapDriver),
  };
}

export async function createTrip(params: TripCreateParams): Promise<TripDto> {
  await assertDraftAssignment(params);
  return mapTrip(await tripsWriter.createDraftTrip(params));
}

export async function updateTrip(id: string, params: TripUpdateParams): Promise<TripDto> {
  const trip = await getRequiredTrip(id);
  assertDraftTrip(trip, "updated");

  await assertDraftAssignment({
    vehicleId: params.vehicleId ?? trip.vehicle.id,
    driverId: params.driverId ?? trip.driver.id,
    cargoWeight: params.cargoWeight ?? toNumber(trip.cargoWeight),
  });

  return mapTrip(await tripsWriter.updateDraftTrip(id, params));
}

export async function deleteTrip(id: string): Promise<TripDto> {
  const trip = await getRequiredTrip(id);
  assertDraftTrip(trip, "deleted");

  return mapTrip(await tripsWriter.deleteDraftTrip(id));
}

export async function dispatchTrip(id: string): Promise<TripDto> {
  const trip = await getRequiredTrip(id);
  assertDraftTrip(trip, "dispatched");

  await assertDispatchableAssignment({
    vehicleId: trip.vehicle.id,
    driverId: trip.driver.id,
    cargoWeight: toNumber(trip.cargoWeight),
  });

  return mapTrip(await tripsWriter.dispatchTrip(id, trip.vehicle.id, trip.driver.id));
}

export async function createAndDispatchTrip(params: TripCreateParams): Promise<TripDto> {
  await assertDispatchableAssignment(params);

  return mapTrip(await tripsWriter.createAndDispatchTrip(params));
}

export async function cancelTrip(id: string): Promise<TripDto> {
  const trip = await getRequiredTrip(id);

  if (trip.status !== TripStatus.DRAFT && trip.status !== TripStatus.DISPATCHED) {
    throw new TripOperationNotAllowedError("Only draft or dispatched trips can be cancelled");
  }

  return mapTrip(
    await tripsWriter.cancelTrip(
      id,
      trip.vehicle.id,
      trip.driver.id,
      trip.status === TripStatus.DISPATCHED,
    ),
  );
}
