import { prisma } from "@/lib/prisma";
import type { DriverStatus } from "@/generated/prisma/enums";
import type { DriverRecord } from "./drivers.types";

function mapToRecord(driver: {
  id: string;
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
  createdAt: Date;
  updatedAt: Date;
}): DriverRecord {
  return {
    id: driver.id,
    fullName: driver.fullName,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiry: driver.licenseExpiry,
    contactNumber: driver.contactNumber,
    safetyScore: driver.safetyScore,
    status: driver.status,
    createdAt: driver.createdAt,
    updatedAt: driver.updatedAt,
  };
}

export async function findDriverById(id: string): Promise<DriverRecord | null> {
  const driver = await prisma.driver.findUnique({ where: { id } });
  return driver ? mapToRecord(driver) : null;
}

export async function findDriverByLicense(licenseNumber: string): Promise<DriverRecord | null> {
  const driver = await prisma.driver.findUnique({ where: { licenseNumber } });
  return driver ? mapToRecord(driver) : null;
}

export async function findAllDrivers(filters: {
  status?: DriverStatus;
  skip: number;
  take: number;
}): Promise<{ drivers: DriverRecord[]; total: number }> {
  const where = {
    ...(filters.status && { status: filters.status }),
  };

  const [drivers, total] = await Promise.all([
    prisma.driver.findMany({
      where,
      skip: filters.skip,
      take: filters.take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.driver.count({ where }),
  ]);

  return {
    drivers: drivers.map(mapToRecord),
    total,
  };
}

export async function findAvailableDrivers(): Promise<DriverRecord[]> {
  const now = new Date();
  const drivers = await prisma.driver.findMany({
    where: {
      status: "AVAILABLE",
      licenseExpiry: { gt: now },
    },
    orderBy: { fullName: "asc" },
  });
  return drivers.map(mapToRecord);
}

export async function createDriverRecord(data: {
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}): Promise<DriverRecord> {
  const driver = await prisma.driver.create({ data });
  return mapToRecord(driver);
}

export async function updateDriverRecord(
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
  const driver = await prisma.driver.update({
    where: { id },
    data,
  });
  return mapToRecord(driver);
}

export async function deleteDriverRecord(id: string): Promise<void> {
  await prisma.driver.delete({ where: { id } });
}

export async function countDriverTrips(id: string): Promise<number> {
  return prisma.trip.count({ where: { driverId: id } });
}
