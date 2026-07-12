import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/constants";
import * as authService from "@/server/modules/auth/auth.service";
import { loginSchema, signupSchema } from "@/server/modules/auth/auth.validators";
import { verifyAuth } from "@/server/shared/middleware/auth-guard";
import {
  buildSuccessResponse,
  createRequestId,
} from "@/server/shared/responses/response-builder";

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
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
  return response;
}

export async function handleSignup(request: Request) {
  const requestId = createRequestId();
  const body = await request.json();
  const input = signupSchema.parse(body);
  const result = await authService.signup(input);

  const response = NextResponse.json(
    buildSuccessResponse({
      message: "Signup successful",
      data: { user: result.user },
      requestId,
    }),
    { status: 201 },
  );

  setAuthCookie(response, result.tokens.accessToken);
  return response;
}

export async function handleMe(request: Request) {
  const requestId = createRequestId();
  const authUser = verifyAuth(request);
  const user = await authService.getCurrentUser(authUser.id);

  return NextResponse.json(
    buildSuccessResponse({
      message: "User fetched successfully",
      data: { user },
      requestId,
    }),
  );
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
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
