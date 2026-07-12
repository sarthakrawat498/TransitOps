import { z } from "zod";

const vehicleStatusEnum = z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]);

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required").max(20, "Registration number too long"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  maxLoadCapacity: z.number().positive("Max load capacity must be positive"),
  odometer: z.number().nonnegative("Odometer cannot be negative").default(0),
  acquisitionCost: z.number().positive("Acquisition cost must be positive"),
  status: vehicleStatusEnum.default("AVAILABLE"),
  region: z.string().optional(),
});

export const updateVehicleSchema = z.object({
  model: z.string().min(1, "Model is required").optional(),
  type: z.string().min(1, "Type is required").optional(),
  maxLoadCapacity: z.number().positive("Max load capacity must be positive").optional(),
  odometer: z.number().nonnegative("Odometer cannot be negative").optional(),
  acquisitionCost: z.number().positive("Acquisition cost must be positive").optional(),
  status: vehicleStatusEnum.optional(),
  region: z.string().nullable().optional(),
});

export const listVehiclesSchema = z.object({
  status: vehicleStatusEnum.optional(),
  type: z.string().optional(),
  region: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type ListVehiclesInput = z.infer<typeof listVehiclesSchema>;
