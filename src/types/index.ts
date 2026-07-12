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
  name: string | null;
}
