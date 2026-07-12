import { handleMe } from "@/server/modules/auth/auth.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleMe);
