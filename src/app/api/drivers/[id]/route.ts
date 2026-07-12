import {
  handleGetDriver,
  handleUpdateDriver,
  handleDeleteDriver,
} from "@/server/modules/drivers/drivers.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleGetDriver);
export const PATCH = withErrorHandler(handleUpdateDriver);
export const DELETE = withErrorHandler(handleDeleteDriver);
