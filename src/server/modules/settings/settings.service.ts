import { RoleName } from "@/generated/prisma/enums";
import * as settingsReader from "@/server/modules/settings/settings.reader";
import type {
  SettingsAccessMatrixItem,
  SettingsPayload,
  UpdateSettingsParams,
} from "@/server/modules/settings/settings.types";
import * as settingsWriter from "@/server/modules/settings/settings.writer";

const defaultGeneralSettings: UpdateSettingsParams = {
  depotName: "TransitOps Central Depot",
  currency: "INR",
  distanceUnit: "kilometers",
};

const accessMatrix: SettingsAccessMatrixItem[] = [
  {
    role: RoleName.FLEET_MANAGER,
    fleet: "manage",
    drivers: "manage",
    trips: "none",
    fuelAndExpenses: "none",
    analytics: "view",
  },
  {
    role: RoleName.DRIVER,
    fleet: "none",
    drivers: "none",
    trips: "view",
    fuelAndExpenses: "none",
    analytics: "none",
  },
  {
    role: RoleName.SAFETY_OFFICER,
    fleet: "none",
    drivers: "manage",
    trips: "view",
    fuelAndExpenses: "none",
    analytics: "view",
  },
  {
    role: RoleName.FINANCIAL_ANALYST,
    fleet: "view",
    drivers: "none",
    trips: "none",
    fuelAndExpenses: "manage",
    analytics: "manage",
  },
  {
    role: RoleName.SUPER_ADMIN,
    fleet: "manage",
    drivers: "manage",
    trips: "manage",
    fuelAndExpenses: "manage",
    analytics: "manage",
  },
];

async function getOrCreateSettingsRecord() {
  const existing = await settingsReader.getAppSettings();
  if (existing) {
    return existing;
  }

  return settingsWriter.saveAppSettings(defaultGeneralSettings);
}

export async function getSettings(): Promise<SettingsPayload> {
  const settings = await getOrCreateSettingsRecord();

  return {
    general: {
      depotName: settings.depotName,
      currency: settings.currency,
      distanceUnit: settings.distanceUnit,
    },
    accessMatrix,
  };
}

export async function updateSettings(input: UpdateSettingsParams): Promise<SettingsPayload> {
  await settingsWriter.saveAppSettings(input);
  return getSettings();
}
