import type { DriverStatus } from "@/generated/prisma/enums";
import {
  DriverNotFoundError,
  DuplicateLicenseError,
  DriverHasActiveTripsError,
} from "./drivers.errors";
import * as driversReader from "./drivers.reader";
import * as driversWriter from "./drivers.writer";
import type {
  DriverRecord,
  CreateDriverParams,
  UpdateDriverParams,
  DriverListParams,
  DriverListResult,
} from "./drivers.types";

export async function listDrivers(params: DriverListParams): Promise<DriverListResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const skip = (page - 1) * limit;

  const { drivers, total } = await driversReader.getDrivers({
    status: params.status,
    skip,
    take: limit,
  });

  return {
    drivers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getDriver(id: string): Promise<DriverRecord> {
  const driver = await driversReader.getDriverById(id);
  if (!driver) {
    throw new DriverNotFoundError();
  }
  return driver;
}

export async function createDriver(params: CreateDriverParams): Promise<DriverRecord> {
  const existing = await driversReader.getDriverByLicense(params.licenseNumber);
  if (existing) {
    throw new DuplicateLicenseError();
  }

  return driversWriter.createDriver({
    fullName: params.fullName,
    licenseNumber: params.licenseNumber,
    licenseCategory: params.licenseCategory,
    licenseExpiry: params.licenseExpiry,
    contactNumber: params.contactNumber,
    safetyScore: params.safetyScore ?? 100,
    status: params.status ?? ("AVAILABLE" as DriverStatus),
  });
}

export async function updateDriver(id: string, params: UpdateDriverParams): Promise<DriverRecord> {
  const existing = await driversReader.getDriverById(id);
  if (!existing) {
    throw new DriverNotFoundError();
  }

  return driversWriter.updateDriver(id, params);
}

export async function deleteDriver(id: string): Promise<void> {
  const existing = await driversReader.getDriverById(id);
  if (!existing) {
    throw new DriverNotFoundError();
  }

  const tripCount = await driversReader.getDriverTripCount(id);
  if (tripCount > 0) {
    throw new DriverHasActiveTripsError();
  }

  await driversWriter.deleteDriver(id);
}

export async function getAvailableDrivers(): Promise<DriverRecord[]> {
  return driversReader.getAvailableDrivers();
}
