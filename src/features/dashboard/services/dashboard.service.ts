import axios from "axios";

import type {
  DashboardFiltersResponseData,
  DashboardOverviewQueryParams,
  DashboardOverviewResponseData,
} from "@/features/dashboard/types";
import type { ApiSuccessResponse } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function buildOverviewParams(params: DashboardOverviewQueryParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null || value === "") {
        return false;
      }

      return value !== "all";
    }),
  );
}

export async function getDashboardFilters() {
  const { data } =
    await api.get<ApiSuccessResponse<DashboardFiltersResponseData>>("/dashboard/filters");

  return data;
}

export async function getDashboardOverview(params: DashboardOverviewQueryParams) {
  const { data } = await api.get<ApiSuccessResponse<DashboardOverviewResponseData>>(
    "/dashboard/overview",
    {
      params: buildOverviewParams(params),
    },
  );

  return data;
}
