import { RoleName } from "@/generated/prisma/enums";
import * as settingsReader from "@/server/modules/settings/settings.reader";
import type {
  SettingsAccessMatrixItem,
  SettingsPayload,
  UpdateSettingsParams,
} from "@/server/modules/settings/settings.types";
import * as settingsWriter from "@/server/modules/settings/settings.writer";
import { getRoleMatrix } from "@/server/shared/rbac/permissions";

const defaultGeneralSettings: UpdateSettingsParams = {
  depotName: "TransitOps Central Depot",
  currency: "INR",
  distanceUnit: "kilometers",
};

const MATRIX_ROLE_ORDER: RoleName[] = [
  RoleName.SUPER_ADMIN,
  RoleName.FLEET_MANAGER,
  RoleName.SAFETY_OFFICER,
  RoleName.FINANCIAL_ANALYST,
  RoleName.DRIVER,
];

function buildAccessMatrix(): SettingsAccessMatrixItem[] {
  const matrix = getRoleMatrix();

  return MATRIX_ROLE_ORDER.map((role) => {
    const permissions = matrix[role];

    return {
      role,
      fleet: permissions.fleet,
      drivers: permissions.drivers,
      trips: permissions.trips,
      maintenance: permissions.maintenance,
      fuelAndExpenses: permissions.fuelAndExpenses,
      analytics: permissions.analytics,
      settings: permissions.settings,
    };
  });
}

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
    accessMatrix: buildAccessMatrix(),
  };
}

export async function updateSettings(input: UpdateSettingsParams): Promise<SettingsPayload> {
  await settingsWriter.saveAppSettings(input);
  return getSettings();
}
