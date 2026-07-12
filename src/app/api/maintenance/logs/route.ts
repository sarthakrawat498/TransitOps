import { handleCreateMaintenanceLog } from "@/server/modules/maintenance/maintenance.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const POST = withErrorHandler(handleCreateMaintenanceLog);
