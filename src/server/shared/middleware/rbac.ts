import { RoleName } from "@/generated/prisma/enums";
import { ForbiddenError } from "@/server/shared/errors/app-error";
import { verifyAuth } from "@/server/shared/middleware/auth-guard";
import type { AuthSessionUser } from "@/types";

export const ALL_ROLES: readonly RoleName[] = Object.values(RoleName);

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
