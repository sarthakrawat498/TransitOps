import { prisma } from "@/lib/prisma";

const GLOBAL_SCOPE = "GLOBAL";

export interface AppSettingsRecordInput {
  depotName: string;
  currency: string;
  distanceUnit: string;
}

export async function findAppSettings() {
  return prisma.appSetting.findUnique({
    where: { scope: GLOBAL_SCOPE },
  });
}

export async function upsertAppSettings(data: AppSettingsRecordInput) {
  return prisma.appSetting.upsert({
    where: { scope: GLOBAL_SCOPE },
    update: {
      depotName: data.depotName,
      currency: data.currency,
      distanceUnit: data.distanceUnit,
    },
    create: {
      scope: GLOBAL_SCOPE,
      depotName: data.depotName,
      currency: data.currency,
      distanceUnit: data.distanceUnit,
    },
  });
}
