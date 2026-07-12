import type { DriverStatus } from "@/generated/prisma/enums";

export interface DriverRecord {
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
}

export interface CreateDriverParams {
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  contactNumber: string;
  safetyScore?: number;
  status?: DriverStatus;
}

export interface UpdateDriverParams {
  fullName?: string;
  licenseCategory?: string;
  licenseExpiry?: Date;
  contactNumber?: string;
  safetyScore?: number;
  status?: DriverStatus;
}

export interface DriverListParams {
  status?: DriverStatus;
  page?: number;
  limit?: number;
}

export interface DriverListResult {
  drivers: DriverRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
