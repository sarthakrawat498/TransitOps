import { handleListVehicles, handleCreateVehicle } from "@/server/modules/vehicles/vehicles.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleListVehicles);
export const POST = withErrorHandler(handleCreateVehicle);
