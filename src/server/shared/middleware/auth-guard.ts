import jwt from "jsonwebtoken";
import { z } from "zod";

import { AUTH_COOKIE_NAME } from "@/constants";
import { RoleName } from "@/generated/prisma/enums";
import { config } from "@/lib/config";
import * as authService from "@/server/modules/auth/auth.service";
import { UnauthorizedError } from "@/server/shared/errors/app-error";
import type { AuthSessionUser } from "@/types";

const jwtPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(1),
  role: z.nativeEnum(RoleName),
});

function extractToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7);
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((part) => {
      const [key, ...value] = part.trim().split("=");
      return [key, decodeURIComponent(value.join("="))];
    }),
  );

  return cookies[AUTH_COOKIE_NAME] ?? null;
}

export async function verifyAuth(request: Request): Promise<AuthSessionUser> {
  const token = extractToken(request);

  if (!token) {
    throw new UnauthorizedError("Authentication token missing");
  }

  let payload: z.infer<typeof jwtPayloadSchema>;

  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ["HS256"],
      issuer: config.jwtIssuer,
      audience: config.jwtAudience,
    });

    payload = jwtPayloadSchema.parse(decoded);
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }

  const user = await authService.getCurrentUser(payload.sub);

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role.name,
  };
}
