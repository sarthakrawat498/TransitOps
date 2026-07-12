import type { UpdateSettingsParams } from "@/server/modules/settings/settings.types";
import * as settingsRepository from "@/server/modules/settings/settings.repository";

export async function saveAppSettings(data: UpdateSettingsParams) {
  return settingsRepository.upsertAppSettings(data);
}
