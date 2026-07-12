import { handleGetAvailableVehicles } from "@/server/modules/vehicles/vehicles.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleGetAvailableVehicles);
