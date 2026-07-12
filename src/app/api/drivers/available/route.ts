import { handleGetAvailableDrivers } from "@/server/modules/drivers/drivers.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleGetAvailableDrivers);
