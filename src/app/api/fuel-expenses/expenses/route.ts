import { handleCreateExpense } from "@/server/modules/fuel-expenses/fuel-expenses.controller";
import { withErrorHandler } from "@/server/shared/middleware/error-handler";

export const POST = withErrorHandler(handleCreateExpense);
