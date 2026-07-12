import type { RoleName } from "@/generated/prisma/enums";

export type SettingsAccessLevel = "manage" | "view" | "none";

export interface SettingsGeneral {
  depotName: string;
  currency: string;
  distanceUnit: string;
}

export interface SettingsAccessMatrixItem {
  role: RoleName;
  fleet: SettingsAccessLevel;
  drivers: SettingsAccessLevel;
  trips: SettingsAccessLevel;
  fuelAndExpenses: SettingsAccessLevel;
  analytics: SettingsAccessLevel;
}

export interface SettingsPayload {
  general: SettingsGeneral;
  accessMatrix: SettingsAccessMatrixItem[];
}

export interface UpdateSettingsParams {
  depotName: string;
  currency: "INR" | "USD" | "EUR";
  distanceUnit: "kilometers" | "miles";
}
