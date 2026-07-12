import axios from "axios";

import type { SettingsUpdateInput } from "@/features/settings/schemas";
import type { SettingsResponseData } from "@/features/settings/types";
import type { ApiSuccessResponse } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getSettings() {
  const { data } = await api.get<ApiSuccessResponse<SettingsResponseData>>("/settings");
  return data;
}

export async function updateSettings(input: SettingsUpdateInput) {
  const { data } = await api.put<ApiSuccessResponse<SettingsResponseData>>("/settings", input);
  return data;
}
