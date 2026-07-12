import { AppError } from "@/server/shared/errors/app-error";

export class InvalidCredentialsError extends AppError {
  constructor(message = "Invalid email or password") {
    super({ message, statusCode: 401, code: "INVALID_CREDENTIALS" });
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(message = "User already exists with this email") {
    super({ message, statusCode: 409, code: "USER_ALREADY_EXISTS" });
  }
}
