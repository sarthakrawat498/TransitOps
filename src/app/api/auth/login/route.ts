import { handleLogin } from "@/server/modules/auth/auth.controller";
import { handleCorsPreflight } from "@/server/shared/middleware/cors";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const OPTIONS = withErrorHandler(handleCorsPreflight);
export const POST = withErrorHandler(handleLogin);
