import jwt from "jsonwebtoken";

import { AUTH_COOKIE_NAME } from "@/constants";
import { config } from "@/lib/config";
import { UnauthorizedError } from "@/server/shared/errors/app-error";
import type { AuthUser } from "@/types";

interface JwtPayload {
  sub: string;
  email: string;
  name?: string | null;
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

export function verifyAuth(request: Request): AuthUser {
  const token = extractToken(request);

  if (!token) {
    throw new UnauthorizedError("Authentication token missing");
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name ?? null,
    };
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
