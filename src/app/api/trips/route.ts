import { handleCreateTrip, handleListTrips } from "@/server/modules/trips/trips.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleListTrips);
export const POST = withErrorHandler(handleCreateTrip);
