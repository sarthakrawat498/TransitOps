import { handleGetFuelExpenses } from "@/server/modules/fuel-expenses/fuel-expenses.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const GET = withErrorHandler(handleGetFuelExpenses);
