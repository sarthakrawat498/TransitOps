"use client";

import { Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { canView, formatRole, type ModuleKey } from "@/lib/rbac";
import { useAuth } from "@/providers/auth-provider";

interface RequireAccessProps {
  module: ModuleKey;
  children: ReactNode;
  moduleLabel?: string;
}

export function RequireAccess({ module, moduleLabel, children }: RequireAccessProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-3 py-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (!user) {
    return <AccessDenied reason="not-signed-in" />;
  }

  if (!canView(user.role.name, module)) {
    return (
      <AccessDenied
        reason="forbidden"
        role={user.role.name}
        moduleLabel={moduleLabel ?? module}
      />
    );
  }

  return <>{children}</>;
}

function AccessDenied({
  reason,
  role,
  moduleLabel,
}: {
  reason: "not-signed-in" | "forbidden";
  role?: string;
  moduleLabel?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-start justify-center py-10">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <span className="mt-1 flex size-9 items-center justify-center rounded-md border border-destructive/40 bg-destructive/10 text-destructive">
            {reason === "not-signed-in" ? <Lock className="size-4" /> : <ShieldAlert className="size-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <CardTitle>
              {reason === "not-signed-in" ? "Please sign in" : "Access restricted"}
            </CardTitle>
            <CardDescription>
              {reason === "not-signed-in"
                ? "You need to be signed in to view this page."
                : `Your role (${role ? formatRole(role) : "unknown"}) does not have access to ${moduleLabel}.`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Contact your Super Admin if you believe you should have access to this module.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
