import { NextResponse } from "next/server";

import { RoleName } from "@/generated/prisma/enums";
import * as settingsService from "@/server/modules/settings/settings.service";
import { settingsUpdateSchema } from "@/server/modules/settings/settings.validators";
import { ALL_ROLES, authorizeRoles } from "@/server/shared/middleware/rbac";
import {
  buildSuccessResponse,
  createRequestId,
} from "@/server/shared/responses/response-builder";

const SETTINGS_EDIT_ROLES: readonly RoleName[] = [RoleName.SUPER_ADMIN, RoleName.FLEET_MANAGER];

export async function handleGetSettings(request: Request) {
  const requestId = createRequestId();
  await authorizeRoles(request, ALL_ROLES);

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
  await authorizeRoles(request, SETTINGS_EDIT_ROLES);

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
