"use client";

import { RequireAccess } from "@/components/layout/require-access";
import { DriversTable } from "@/features/drivers/components/drivers-table";

export default function DriversPage() {
  return (
    <RequireAccess module="drivers" moduleLabel="Driver management">
      <div className="mx-auto w-full max-w-7xl py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Driver Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your drivers. Track license status, safety scores, and availability.
          </p>
        </div>

        <DriversTable />
      </div>
    </RequireAccess>
  );
}
