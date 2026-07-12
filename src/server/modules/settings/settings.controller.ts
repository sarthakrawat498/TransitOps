import { NextResponse } from "next/server";

import * as settingsService from "@/server/modules/settings/settings.service";
import { settingsUpdateSchema } from "@/server/modules/settings/settings.validators";
import { authorizeRead, authorizeWrite } from "@/server/shared/middleware/rbac";
import {
  buildSuccessResponse,
  createRequestId,
} from "@/server/shared/responses/response-builder";

export async function handleGetSettings(request: Request) {
  const requestId = createRequestId();
  await authorizeRead(request, "settings");

  const settings = await settingsService.getSettings();

  return NextResponse.json(
    buildSuccessResponse({
      message: "Settings fetched successfully",
      data: settings,
      requestId,
    }),
  );
}

export async function handleUpdateSettings(request: Request) {
  const requestId = createRequestId();
  await authorizeWrite(request, "settings");

  const body = await request.json();
  const input = settingsUpdateSchema.parse(body);
  const settings = await settingsService.updateSettings(input);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Settings updated successfully",
      data: settings,
      requestId,
    }),
  );
}
