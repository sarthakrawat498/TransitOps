"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";

import * as authService from "@/features/auth/services/auth.service";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await authService.getCurrentUser();
        return response.data?.user ?? null;
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      isAuthenticated: Boolean(data),
      isLoading,
      logout: async () => {
        await authService.logout();
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      },
    }),
    [data, isLoading, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
