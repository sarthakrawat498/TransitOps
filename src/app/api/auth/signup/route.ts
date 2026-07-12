import { NextResponse } from "next/server";

import { handleCorsPreflight } from "@/server/shared/middleware/cors";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";
import {
  buildErrorResponse,
  createRequestId,
} from "@/server/shared/responses/response-builder";

async function handleSignupDisabled() {
  return NextResponse.json(
    buildErrorResponse({
      message: "Signup is disabled for this deployment",
      requestId: createRequestId(),
    }),
    { status: 404 },
  );
}

export const OPTIONS = withErrorHandler(handleCorsPreflight);
export const POST = withErrorHandler(handleSignupDisabled);
