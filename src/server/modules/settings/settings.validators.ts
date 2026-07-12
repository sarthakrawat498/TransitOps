import { z } from "zod";

export const settingsUpdateSchema = z.object({
  depotName: z.string().trim().min(2).max(120),
  currency: z.enum(["INR", "USD", "EUR"]),
  distanceUnit: z.enum(["kilometers", "miles"]),
});

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;
