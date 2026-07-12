import { RoleName } from "@/generated/prisma/enums";
import { ForbiddenError } from "@/server/shared/errors/app-error";
import { verifyAuth } from "@/server/shared/middleware/auth-guard";
import {
  ALL_ROLES,
  getReadRoles,
  getWriteRoles,
  type ModuleKey,
} from "@/server/shared/rbac/permissions";
import type { AuthSessionUser } from "@/types";

export { ALL_ROLES };

export async function authorizeRoles(
  request: Request,
  allowedRoles: readonly RoleName[],
): Promise<AuthSessionUser> {
  const authUser = await verifyAuth(request);

  if (!allowedRoles.includes(authUser.role)) {
    throw new ForbiddenError("You do not have permission to access this resource");
  }

  return authUser;
}

export async function authorizeRead(
  request: Request,
  module: ModuleKey,
): Promise<AuthSessionUser> {
  return authorizeRoles(request, getReadRoles(module));
}

export async function authorizeWrite(
  request: Request,
  module: ModuleKey,
): Promise<AuthSessionUser> {
  return authorizeRoles(request, getWriteRoles(module));
}
