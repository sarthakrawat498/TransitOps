"use client";

import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuth } from "@/providers/auth-provider";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Not signed in</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account details and current role.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="flex size-14 items-center justify-center rounded-full border border-border bg-secondary text-base font-semibold">
            {getInitials(user.fullName)}
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{user.fullName}</CardTitle>
            <CardDescription className="truncate">{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2">
              <UserRound className="size-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Full name</p>
                <p className="truncate font-medium">{user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2">
              <Mail className="size-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                <p className="truncate font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2">
              <ShieldCheck className="size-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Role</p>
                <div className="mt-1">
                  <Badge variant="secondary" className="font-medium">
                    {formatRole(user.role.name)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => logout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
