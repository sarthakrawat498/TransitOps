"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import * as authService from "@/features/auth/services/auth.service";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      queryClient.clear();
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to sign out. Please try again.");
    },
  });
}
