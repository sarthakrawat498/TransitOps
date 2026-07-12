import { z } from "zod";

const driverStatusEnum = z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]);

export const createDriverSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  licenseNumber: z.string().min(1, "License number is required").max(30, "License number too long"),
  licenseCategory: z.string().min(1, "License category is required"),
  licenseExpiry: z.coerce.date({ message: "Valid license expiry date is required" }),
  contactNumber: z.string().min(10, "Contact number must be at least 10 characters").max(15, "Contact number too long"),
  safetyScore: z.number().int().min(0).max(100).default(100),
  status: driverStatusEnum.default("AVAILABLE"),
});

export const updateDriverSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  licenseCategory: z.string().min(1, "License category is required").optional(),
  licenseExpiry: z.coerce.date({ message: "Valid license expiry date is required" }).optional(),
  contactNumber: z.string().min(10, "Contact number must be at least 10 characters").max(15, "Contact number too long").optional(),
  safetyScore: z.number().int().min(0).max(100).optional(),
  status: driverStatusEnum.optional(),
});

export const listDriversSchema = z.object({
  status: driverStatusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
export type ListDriversInput = z.infer<typeof listDriversSchema>;
