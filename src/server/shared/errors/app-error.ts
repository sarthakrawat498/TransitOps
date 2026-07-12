export interface AppErrorOptions {
  message: string;
  statusCode: number;
  code: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.statusCode = options.statusCode;
    this.code = options.code;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super({ message, statusCode: 404, code: "NOT_FOUND" });
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super({ message, statusCode: 400, code: "VALIDATION_ERROR" });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super({ message, statusCode: 401, code: "UNAUTHORIZED" });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super({ message, statusCode: 403, code: "FORBIDDEN" });
  }
}
