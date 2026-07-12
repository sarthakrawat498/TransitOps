import { z } from "zod";

const expenseCategoryValues = ["TOLL", "PERMIT", "INSURANCE", "FINE", "PARKING", "OTHER"] as const;

function emptyStringToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const optionalUuid = z.preprocess(emptyStringToUndefined, z.string().uuid().optional());
export const createFuelLogSchema = z.object({
  vehicleId: z.string().uuid("Vehicle is required"),
  tripId: optionalUuid,
  liters: z.coerce.number().positive("Liters must be greater than 0").max(100000),
  cost: z.coerce.number().nonnegative("Cost cannot be negative").max(100000000),
  logDate: z.coerce.date(),
});

export const createExpenseSchema = z.object({
  vehicleId: z.string().uuid("Vehicle is required"),
  category: z.enum(expenseCategoryValues),
  amount: z.coerce.number().positive("Amount must be greater than 0").max(100000000),
  expenseDate: z.coerce.date(),
  description: z.string().trim().max(500).optional(),
});

export type CreateFuelLogInput = z.infer<typeof createFuelLogSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
