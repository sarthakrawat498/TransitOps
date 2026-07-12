import { AppError } from "@/server/shared/errors/app-error";

export class AnalyticsError extends AppError {
  constructor(message = "Analytics request failed") {
    super({ message, statusCode: 400, code: "ANALYTICS_ERROR" });
  }
}
