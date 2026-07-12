import { AppError } from "@/server/shared/errors/app-error";

export class SettingsError extends AppError {
  constructor(message = "Settings request failed") {
    super({ message, statusCode: 400, code: "SETTINGS_ERROR" });
  }
}
