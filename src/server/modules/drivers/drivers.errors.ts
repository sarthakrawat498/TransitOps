import { AppError } from "@/server/shared/errors/app-error";

export class DriverNotFoundError extends AppError {
  constructor(message = "Driver not found") {
    super({ message, statusCode: 404, code: "DRIVER_NOT_FOUND" });
  }
}

export class DuplicateLicenseError extends AppError {
  constructor(message = "A driver with this license number already exists") {
    super({ message, statusCode: 409, code: "DUPLICATE_LICENSE" });
  }
}

export class DriverHasActiveTripsError extends AppError {
  constructor(message = "Cannot delete driver with existing trips") {
    super({ message, statusCode: 400, code: "DRIVER_HAS_ACTIVE_TRIPS" });
  }
}

export class DriverLicenseExpiredError extends AppError {
  constructor(message = "Driver's license has expired") {
    super({ message, statusCode: 400, code: "DRIVER_LICENSE_EXPIRED" });
  }
}

export class DriverNotAvailableError extends AppError {
  constructor(message = "Driver is not available for assignment") {
    super({ message, statusCode: 400, code: "DRIVER_NOT_AVAILABLE" });
  }
}
