import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/constants";
import { config } from "@/lib/config";
import * as authService from "@/server/modules/auth/auth.service";
import { loginSchema } from "@/server/modules/auth/auth.validators";
import { ALL_ROLES, authorizeRoles } from "@/server/shared/middleware/rbac";
import {
  buildSuccessResponse,
  createRequestId,
} from "@/server/shared/responses/response-builder";

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: config.authCookieSameSite,
    secure: config.authCookieSecure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    priority: "high",
  });
}

function setNoStoreHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function handleLogin(request: Request) {
  const requestId = createRequestId();
  const body = await request.json();
  const input = loginSchema.parse(body);
  const result = await authService.login(input);

  const response = NextResponse.json(
    buildSuccessResponse({
      message: "Login successful",
      data: { user: result.user },
      requestId,
    }),
  );

  setAuthCookie(response, result.tokens.accessToken);
  return setNoStoreHeaders(response);
}

export async function handleMe(request: Request) {
  const requestId = createRequestId();
  const authUser = await authorizeRoles(request, ALL_ROLES);
  const user = await authService.getCurrentUser(authUser.id);

  const response = NextResponse.json(
    buildSuccessResponse({
      message: "User fetched successfully",
      data: { user },
      requestId,
    }),
  );

  return setNoStoreHeaders(response);
}

export async function handleLogout() {
  const requestId = createRequestId();
  const response = NextResponse.json(
    buildSuccessResponse({
      message: "Logout successful",
      requestId,
    }),
  );

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: config.authCookieSameSite,
    secure: config.authCookieSecure,
    path: "/",
    maxAge: 0,
    priority: "high",
  });

  return setNoStoreHeaders(response);
}
