import { handleListDrivers, handleCreateDriver } from "@/server/modules/drivers/drivers.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleListDrivers);
export const POST = withErrorHandler(handleCreateDriver);
