import { AppError } from "@/server/shared/errors/app-error";

export class DashboardError extends AppError {
  constructor(message = "Dashboard request failed") {
    super({ message, statusCode: 400, code: "DASHBOARD_ERROR" });
  }
}
