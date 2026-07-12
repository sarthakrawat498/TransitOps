import { randomUUID } from "crypto";

export function generateRequestId(): string {
  return randomUUID();
}

export function toJson<T>(value: T): string {
  return JSON.stringify(value);
}
