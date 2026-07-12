"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SearchProvider } from "@/providers/search-provider";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <SearchProvider>
          {children}
          <Toaster />
        </SearchProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
