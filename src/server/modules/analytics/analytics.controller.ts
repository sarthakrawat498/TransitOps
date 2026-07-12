import { NextResponse } from "next/server";

import { RoleName } from "@/generated/prisma/enums";
import * as analyticsService from "@/server/modules/analytics/analytics.service";
import { analyticsOverviewQuerySchema } from "@/server/modules/analytics/analytics.validators";
import { authorizeRoles } from "@/server/shared/middleware/rbac";
import { buildSuccessResponse, createRequestId } from "@/server/shared/responses/response-builder";

const ANALYTICS_READ_ROLES = [
  RoleName.SUPER_ADMIN,
  RoleName.FLEET_MANAGER,
  RoleName.FINANCIAL_ANALYST,
] as const;

function getSearchParam(request: Request, key: string): string | undefined {
  return new URL(request.url).searchParams.get(key) ?? undefined;
}

export async function handleGetAnalyticsOverview(request: Request) {
  const requestId = createRequestId();
  await authorizeRoles(request, ANALYTICS_READ_ROLES);

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
  await authorizeRoles(request, ANALYTICS_READ_ROLES);

  const filters = await analyticsService.getFilters();

  return NextResponse.json(
    buildSuccessResponse({
      message: "Analytics filters fetched successfully",
      data: filters,
      requestId,
    }),
  );
}
