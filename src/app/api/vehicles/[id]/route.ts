import {
  handleGetVehicle,
  handleUpdateVehicle,
  handleDeleteVehicle,
} from "@/server/modules/vehicles/vehicles.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleGetVehicle);
export const PATCH = withErrorHandler(handleUpdateVehicle);
export const DELETE = withErrorHandler(handleDeleteVehicle);
