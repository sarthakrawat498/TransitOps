import { z } from "zod";

const vehicleStatusValues = ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"] as const;
const tripStatusValues = ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"] as const;

function emptyStringToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const optionalTrimmedString = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(1).optional(),
);

export const dashboardOverviewQuerySchema = z.object({
  vehicleType: optionalTrimmedString,
  vehicleStatus: z.preprocess(emptyStringToUndefined, z.enum(vehicleStatusValues).optional()),
  region: optionalTrimmedString,
  tripStatus: z.preprocess(emptyStringToUndefined, z.enum(tripStatusValues).optional()),
  recentTripsLimit: z.coerce.number().int().min(1).max(25).default(5),
});

export type DashboardOverviewQuery = z.infer<typeof dashboardOverviewQuerySchema>;
