import axios from "axios";

import type {
  AnalyticsFiltersResponseData,
  AnalyticsOverviewQueryParams,
  AnalyticsOverviewResponseData,
} from "@/features/analytics/types";
import type { ApiSuccessResponse } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function buildOverviewParams(params: AnalyticsOverviewQueryParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null || value === "") {
        return false;
      }

      return value !== "all";
    }),
  );
}

export async function getAnalyticsFilters() {
  const { data } =
    await api.get<ApiSuccessResponse<AnalyticsFiltersResponseData>>("/analytics/filters");

  return data;
}

export async function getAnalyticsOverview(params: AnalyticsOverviewQueryParams) {
  const { data } = await api.get<ApiSuccessResponse<AnalyticsOverviewResponseData>>(
    "/analytics/overview",
    {
      params: buildOverviewParams(params),
    },
  );

  return data;
}
