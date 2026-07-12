import { ZodError } from "zod";
import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { AppError } from "@/server/shared/errors/app-error";
import { applyCorsHeaders, assertCorsOrigin } from "@/server/shared/middleware/cors";
import { buildErrorResponse, createRequestId } from "@/server/shared/responses/response-builder";

type RouteHandler<TContext = unknown> = (
  request: Request,
  context: TContext,
) => Promise<NextResponse> | NextResponse;

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export function withErrorHandler<TContext = unknown>(
  handler: RouteHandler<TContext>,
): RouteHandler<TContext> {
  return async (request: Request, context: TContext) => {
    const requestId = createRequestId();

    try {
      assertCorsOrigin(request);
      const response = await handler(request, context);
      return applySecurityHeaders(applyCorsHeaders(response, request));
    } catch (error) {
      if (error instanceof AppError) {
        logger.warn(error.message, requestId, { code: error.code });
        const response = NextResponse.json(
          buildErrorResponse({
            message: error.message,
            requestId,
          }),
          { status: error.statusCode },
        );
        return applySecurityHeaders(applyCorsHeaders(response, request));
      }

      if (error instanceof ZodError) {
        logger.warn("Validation failed", requestId);
        const response = NextResponse.json(
          buildErrorResponse({
            message: "Validation failed",
            errors: error.flatten(),
            requestId,
          }),
          { status: 400 },
        );
        return applySecurityHeaders(applyCorsHeaders(response, request));
      }

      logger.error("Unhandled error", requestId, {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      const response = NextResponse.json(
        buildErrorResponse({
          message: "Internal server error",
          requestId,
        }),
        { status: 500 },
      );
      return applySecurityHeaders(applyCorsHeaders(response, request));
    }
  };
}
