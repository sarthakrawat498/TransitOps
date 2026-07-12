import { AppError } from "@/server/shared/errors/app-error";

export class TripNotFoundError extends AppError {
  constructor(message = "Trip not found") {
    super({ message, statusCode: 404, code: "TRIP_NOT_FOUND" });
  }
}

export class TripOperationNotAllowedError extends AppError {
  constructor(message = "Trip operation is not allowed") {
    super({ message, statusCode: 400, code: "TRIP_OPERATION_NOT_ALLOWED" });
  }
}

export class TripAssignmentUnavailableError extends AppError {
  constructor(message = "Vehicle or driver is not available for this trip") {
    super({ message, statusCode: 409, code: "TRIP_ASSIGNMENT_UNAVAILABLE" });
  }
}
