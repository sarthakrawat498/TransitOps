import { z } from "zod";

const tripStatusValues = ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"] as const;

function emptyStringToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const optionalTrimmedString = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(1).optional(),
);

const positiveNumber = z.coerce.number().positive();
const optionalNonNegativeNumber = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().nonnegative().optional(),
);

export const tripIdParamSchema = z.string().uuid();

export const tripListQuerySchema = z.object({
  status: z.preprocess(emptyStringToUndefined, z.enum(tripStatusValues).optional()),
  vehicleId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  driverId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  source: optionalTrimmedString,
  destination: optionalTrimmedString,
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const createTripSchema = z.object({
  vehicleId: z.string().uuid("Vehicle is required"),
  driverId: z.string().uuid("Driver is required"),
  source: z.string().trim().min(1, "Source is required"),
  destination: z.string().trim().min(1, "Destination is required"),
  cargoWeight: positiveNumber,
  plannedDistance: positiveNumber,
  revenue: optionalNonNegativeNumber,
});

export const updateTripSchema = z
  .object({
    vehicleId: z.string().uuid().optional(),
    driverId: z.string().uuid().optional(),
    source: z.string().trim().min(1).optional(),
    destination: z.string().trim().min(1).optional(),
    cargoWeight: positiveNumber.optional(),
    plannedDistance: positiveNumber.optional(),
    revenue: z.preprocess(
      (value) => (value === "" ? null : value),
      z.coerce.number().nonnegative().nullable().optional(),
    ),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type TripListQuery = z.infer<typeof tripListQuerySchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
