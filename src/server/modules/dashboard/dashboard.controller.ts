import { NextResponse } from "next/server";

import * as dashboardService from "@/server/modules/dashboard/dashboard.service";
import { dashboardOverviewQuerySchema } from "@/server/modules/dashboard/dashboard.validators";
import { verifyAuth } from "@/server/shared/middleware/auth-guard";
import { buildSuccessResponse, createRequestId } from "@/server/shared/responses/response-builder";

function getSearchParam(request: Request, key: string): string | undefined {
  return new URL(request.url).searchParams.get(key) ?? undefined;
}

export async function handleGetDashboardOverview(request: Request) {
  const requestId = createRequestId();
  verifyAuth(request);

  const filters = dashboardOverviewQuerySchema.parse({
    vehicleType: getSearchParam(request, "vehicleType"),
    vehicleStatus: getSearchParam(request, "vehicleStatus"),
    region: getSearchParam(request, "region"),
    tripStatus: getSearchParam(request, "tripStatus"),
    recentTripsLimit: getSearchParam(request, "recentTripsLimit"),
  });
  const overview = await dashboardService.getOverview(filters);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Dashboard overview fetched successfully",
      data: overview,
      requestId,
    }),
  );
}

export async function handleGetDashboardFilters(request: Request) {
  const requestId = createRequestId();
  verifyAuth(request);

  const filters = await dashboardService.getFilters();

  return NextResponse.json(
    buildSuccessResponse({
      message: "Dashboard filters fetched successfully",
      data: filters,
      requestId,
    }),
  );
}
