import type {
  SettingsAccessLevel,
  SettingsAccessMatrixItem,
  SettingsPayload,
} from "@/server/modules/settings/settings.types";

export type {
  SettingsAccessLevel,
  SettingsAccessMatrixItem,
  SettingsPayload as SettingsResponseData,
};

export interface SettingsFormValues {
  depotName: string;
  currency: "INR" | "USD" | "EUR";
  distanceUnit: "kilometers" | "miles";
}
