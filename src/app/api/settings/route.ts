import {
  handleGetSettings,
  handleUpdateSettings,
} from "@/server/modules/settings/settings.controller";
import { handleCorsPreflight } from "@/server/shared/middleware/cors";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const OPTIONS = withErrorHandler(handleCorsPreflight);
export const GET = withErrorHandler(handleGetSettings);
export const PUT = withErrorHandler(handleUpdateSettings);
