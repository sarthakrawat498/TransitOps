import axios from "axios";

import type { LoginInput, SignupInput } from "@/features/auth/schemas";
import type { ApiSuccessResponse, AuthUser } from "@/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function login(input: LoginInput) {
  const { data } = await api.post<ApiSuccessResponse<{ user: AuthUser }>>("/auth/login", input);
  return data;
}

export async function signup(input: SignupInput) {
  const { data } = await api.post<ApiSuccessResponse<{ user: AuthUser }>>("/auth/signup", input);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<ApiSuccessResponse<{ user: AuthUser }>>("/auth/me");
  return data;
}

export async function logout() {
  const { data } = await api.post<ApiSuccessResponse>("/auth/logout");
  return data;
}
