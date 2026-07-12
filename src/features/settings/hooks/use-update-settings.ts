"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as settingsService from "@/features/settings/services/settings.service";
import type { SettingsUpdateInput } from "@/features/settings/schemas";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SettingsUpdateInput) => settingsService.updateSettings(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings", "global"] });
    },
  });
}
