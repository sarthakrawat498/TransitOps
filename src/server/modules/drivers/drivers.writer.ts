import type { DriverStatus } from "@/generated/prisma/enums";
import type { DriverRecord } from "./drivers.types";
import * as driversRepository from "./drivers.repository";

export async function createDriver(data: {
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}): Promise<DriverRecord> {
  return driversRepository.createDriverRecord(data);
}

export async function updateDriver(
  id: string,
  data: {
    fullName?: string;
    licenseCategory?: string;
    licenseExpiry?: Date;
    contactNumber?: string;
    safetyScore?: number;
    status?: DriverStatus;
  }
): Promise<DriverRecord> {
  return driversRepository.updateDriverRecord(id, data);
}

export async function deleteDriver(id: string): Promise<void> {
  return driversRepository.deleteDriverRecord(id);
}
