import { handleGetDashboardOverview } from "@/server/modules/dashboard/dashboard.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleGetDashboardOverview);
