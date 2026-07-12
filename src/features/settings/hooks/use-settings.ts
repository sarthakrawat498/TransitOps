"use client";

import { useQuery } from "@tanstack/react-query";

import * as settingsService from "@/features/settings/services/settings.service";

export function useSettings() {
  return useQuery({
    queryKey: ["settings", "global"],
    queryFn: async () => {
      const response = await settingsService.getSettings();
      return response.data;
    },
  });
}
