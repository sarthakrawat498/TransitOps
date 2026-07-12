import { handleDispatchTrip } from "@/server/modules/trips/trips.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const POST = withErrorHandler(handleDispatchTrip);
