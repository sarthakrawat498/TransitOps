import { NextResponse } from "next/server";

import * as analyticsService from "@/server/modules/analytics/analytics.service";
import { analyticsOverviewQuerySchema } from "@/server/modules/analytics/analytics.validators";
import { authorizeRead } from "@/server/shared/middleware/rbac";
import { buildSuccessResponse, createRequestId } from "@/server/shared/responses/response-builder";

function getSearchParam(request: Request, key: string): string | undefined {
  return new URL(request.url).searchParams.get(key) ?? undefined;
}

export async function handleGetAnalyticsOverview(request: Request) {
  const requestId = createRequestId();
  await authorizeRead(request, "analytics");

  const filters = analyticsOverviewQuerySchema.parse({
    startDate: getSearchParam(request, "startDate"),
    endDate: getSearchParam(request, "endDate"),
    vehicleType: getSearchParam(request, "vehicleType"),
    region: getSearchParam(request, "region"),
    vehicleId: getSearchParam(request, "vehicleId"),
  });
  const overview = await analyticsService.getOverview(filters);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Analytics overview fetched successfully",
      data: overview,
      requestId,
    }),
  );
}

export async function handleGetAnalyticsFilters(request: Request) {
  const requestId = createRequestId();
  await authorizeRead(request, "analytics");

  const filters = await analyticsService.getFilters();

  return NextResponse.json(
    buildSuccessResponse({
      message: "Analytics filters fetched successfully",
      data: filters,
      requestId,
    }),
  );
}
