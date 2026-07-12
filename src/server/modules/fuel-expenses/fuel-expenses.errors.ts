import { AppError } from "@/server/shared/errors/app-error";

export class FuelExpenseNotFoundError extends AppError {
  constructor(message = "Fuel expense resource not found") {
    super({ message, statusCode: 404, code: "FUEL_EXPENSE_NOT_FOUND" });
  }
}

export class FuelExpenseValidationError extends AppError {
  constructor(message = "Invalid fuel expense request") {
    super({ message, statusCode: 400, code: "FUEL_EXPENSE_VALIDATION_ERROR" });
  }
}
