import { AppError } from "@/server/shared/errors/app-error";

export class VehicleNotFoundError extends AppError {
  constructor(message = "Vehicle not found") {
    super({ message, statusCode: 404, code: "VEHICLE_NOT_FOUND" });
  }
}

export class DuplicateRegistrationError extends AppError {
  constructor(message = "A vehicle with this registration number already exists") {
    super({ message, statusCode: 409, code: "DUPLICATE_REGISTRATION" });
  }
}

export class VehicleHasActiveTripsError extends AppError {
  constructor(message = "Cannot delete vehicle with existing trips") {
    super({ message, statusCode: 400, code: "VEHICLE_HAS_ACTIVE_TRIPS" });
  }
}
