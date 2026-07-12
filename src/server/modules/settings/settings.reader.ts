import * as settingsRepository from "@/server/modules/settings/settings.repository";

export async function getAppSettings() {
  return settingsRepository.findAppSettings();
}
