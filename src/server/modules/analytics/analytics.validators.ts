import { z } from "zod";

function emptyStringToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const optionalTrimmedString = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(1).optional(),
);

const optionalDate = z.preprocess(emptyStringToUndefined, z.coerce.date().optional());

export const analyticsOverviewQuerySchema = z
  .object({
    startDate: optionalDate,
    endDate: optionalDate,
    vehicleType: optionalTrimmedString,
    region: optionalTrimmedString,
    vehicleId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  })
  .superRefine((value, context) => {
    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after start date.",
      });
    }
  });

export type AnalyticsOverviewQuery = z.infer<typeof analyticsOverviewQuerySchema>;
