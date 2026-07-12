import { AppError } from "@/server/shared/errors/app-error";

export class MaintenanceNotFoundError extends AppError {
  constructor(message = "Maintenance resource not found") {
    super({ message, statusCode: 404, code: "MAINTENANCE_NOT_FOUND" });
  }
}

export class MaintenanceValidationError extends AppError {
  constructor(message = "Invalid maintenance request") {
    super({ message, statusCode: 400, code: "MAINTENANCE_VALIDATION_ERROR" });
  }
}
