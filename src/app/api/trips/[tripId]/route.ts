import {
  handleDeleteTrip,
  handleGetTrip,
  handleUpdateTrip,
} from "@/server/modules/trips/trips.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleGetTrip);
export const PATCH = withErrorHandler(handleUpdateTrip);
export const DELETE = withErrorHandler(handleDeleteTrip);
