import { z } from "zod";

const maintenanceStatusValues = ["OPEN", "CLOSED"] as const;

function emptyStringToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const optionalDate = z.preprocess(emptyStringToUndefined, z.coerce.date().optional());

export const createMaintenanceLogSchema = z.object({
  vehicleId: z.string().uuid("Vehicle is required"),
  service: z.string().trim().min(3, "Service must be at least 3 characters").max(500),
  cost: z.coerce
    .number()
    .int("Cost must be a whole number")
    .nonnegative("Cost cannot be negative")
    .max(100000000),
  status: z.enum(maintenanceStatusValues).default("OPEN"),
  startedAt: z.coerce.date(),
  completedAt: optionalDate,
});

export type CreateMaintenanceLogInput = z.infer<typeof createMaintenanceLogSchema>;
