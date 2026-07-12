import type { RoleName } from "@/generated/prisma/enums";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  timestamp: string;
  requestId: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: {
    id: string;
    name: RoleName;
    description: string | null;
  };
}

export interface AuthSessionUser {
  id: string;
  email: string;
  fullName: string;
  role: RoleName;
}
