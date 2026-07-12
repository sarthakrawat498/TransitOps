import type { DriverStatus } from "@/generated/prisma/enums";
import type { DriverRecord } from "./drivers.types";
import * as driversRepository from "./drivers.repository";

export async function getDriverById(id: string): Promise<DriverRecord | null> {
  return driversRepository.findDriverById(id);
}

export async function getDriverByLicense(licenseNumber: string): Promise<DriverRecord | null> {
  return driversRepository.findDriverByLicense(licenseNumber);
}

export async function getDrivers(filters: {
  status?: DriverStatus;
  skip: number;
  take: number;
}): Promise<{ drivers: DriverRecord[]; total: number }> {
  return driversRepository.findAllDrivers(filters);
}

export async function getAvailableDrivers(): Promise<DriverRecord[]> {
  return driversRepository.findAvailableDrivers();
}

export async function getDriverTripCount(id: string): Promise<number> {
  return driversRepository.countDriverTrips(id);
}
