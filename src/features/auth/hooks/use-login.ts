"use client";

import { useMutation } from "@tanstack/react-query";

import * as authService from "@/features/auth/services/auth.service";
import type { LoginInput } from "@/features/auth/schemas";

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
  });
}
