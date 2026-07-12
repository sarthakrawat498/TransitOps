import jwt from "jsonwebtoken";

import { AUTH_COOKIE_NAME } from "@/constants";
import type { RoleName } from "@/generated/prisma/enums";
import { config } from "@/lib/config";
import { UnauthorizedError } from "@/server/shared/errors/app-error";
import type { AuthSessionUser } from "@/types";

interface JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  role: RoleName;
}

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
      return [key, value.join("=")];
    }),
  );

  return cookies[AUTH_COOKIE_NAME] ?? null;
}

export function verifyAuth(request: Request): AuthSessionUser {
  const token = extractToken(request);

  if (!token) {
    throw new UnauthorizedError("Authentication token missing");
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;

    return {
      id: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role,
    };
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
