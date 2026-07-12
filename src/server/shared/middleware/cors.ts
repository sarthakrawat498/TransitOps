import { NextResponse } from "next/server";

import { config } from "@/lib/config";
import { ForbiddenError } from "@/server/shared/errors/app-error";

const CORS_ALLOWED_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const CORS_ALLOWED_HEADERS = "Content-Type, Authorization, X-Request-Id";
const CORS_MAX_AGE_SECONDS = "86400";

function isOriginAllowed(origin: string): boolean {
  return config.corsAllowedOrigins.includes(origin);
}

function setCorsHeaders(response: NextResponse, origin: string): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", CORS_ALLOWED_METHODS);
  response.headers.set("Access-Control-Allow-Headers", CORS_ALLOWED_HEADERS);
  response.headers.set("Access-Control-Max-Age", CORS_MAX_AGE_SECONDS);
  response.headers.set("Vary", "Origin");
  return response;
}

export function assertCorsOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin) {
    return;
  }

  if (!isOriginAllowed(origin)) {
    throw new ForbiddenError("Origin is not allowed");
  }
}

export function applyCorsHeaders(response: NextResponse, request: Request): NextResponse {
  const origin = request.headers.get("origin");
  if (!origin || !isOriginAllowed(origin)) {
    return response;
  }

  return setCorsHeaders(response, origin);
}

export function handleCorsPreflight(request: Request): NextResponse {
  assertCorsOrigin(request);

  const origin = request.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });

  if (!origin) {
    return response;
  }

  return setCorsHeaders(response, origin);
}
