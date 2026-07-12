import { randomUUID } from "crypto";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";

export function createRequestId(): string {
  return randomUUID();
}

export function buildSuccessResponse<T>(options: {
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  requestId?: string;
}): ApiSuccessResponse<T> {
  return {
    success: true,
    message: options.message,
    data: options.data,
    meta: options.meta,
    timestamp: new Date().toISOString(),
    requestId: options.requestId ?? createRequestId(),
  };
}

export function buildErrorResponse(options: {
  message: string;
  errors?: Record<string, unknown>;
  requestId?: string;
}): ApiErrorResponse {
  return {
    success: false,
    message: options.message,
    errors: options.errors,
    timestamp: new Date().toISOString(),
    requestId: options.requestId,
  };
}
