import { ZodError } from "zod";
import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { AppError } from "@/server/shared/errors/app-error";
import {
  buildErrorResponse,
  createRequestId,
} from "@/server/shared/responses/response-builder";

type RouteHandler = (request: Request, context?: unknown) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request: Request, context?: unknown) => {
    const requestId = createRequestId();

    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AppError) {
        logger.warn(error.message, requestId, { code: error.code });
        return NextResponse.json(
          buildErrorResponse({
            message: error.message,
            requestId,
          }),
          { status: error.statusCode },
        );
      }

      if (error instanceof ZodError) {
        logger.warn("Validation failed", requestId);
        return NextResponse.json(
          buildErrorResponse({
            message: "Validation failed",
            errors: error.flatten(),
            requestId,
          }),
          { status: 400 },
        );
      }

      logger.error("Unhandled error", requestId, {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json(
        buildErrorResponse({
          message: "Internal server error",
          requestId,
        }),
        { status: 500 },
      );
    }
  };
}
