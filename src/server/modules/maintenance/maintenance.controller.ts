import { NextResponse } from "next/server";

import * as maintenanceService from "@/server/modules/maintenance/maintenance.service";
import { createMaintenanceLogSchema } from "@/server/modules/maintenance/maintenance.validators";
import { authorizeRead, authorizeWrite } from "@/server/shared/middleware/rbac";
import { buildSuccessResponse, createRequestId } from "@/server/shared/responses/response-builder";

function setNoStoreHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function handleGetMaintenance(request: Request) {
  const requestId = createRequestId();
  await authorizeRead(request, "maintenance");

  const overview = await maintenanceService.getOverview();
  const response = NextResponse.json(
    buildSuccessResponse({
      message: "Maintenance overview fetched successfully",
      data: overview,
      requestId,
    }),
  );

  return setNoStoreHeaders(response);
}

export async function handleCreateMaintenanceLog(request: Request) {
  const requestId = createRequestId();
  await authorizeWrite(request, "maintenance");

  const body = await request.json();
  const input = createMaintenanceLogSchema.parse(body);
  const maintenanceLog = await maintenanceService.createMaintenanceLog(input);

  const response = NextResponse.json(
    buildSuccessResponse({
      message: "Maintenance log created successfully",
      data: { maintenanceLog },
      requestId,
    }),
    { status: 201 },
  );

  return setNoStoreHeaders(response);
}
