import { handleGetAnalyticsFilters } from "@/server/modules/analytics/analytics.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleGetAnalyticsFilters);
