"use client";

import { RequireAccess } from "@/components/layout/require-access";
import { VehiclesTable } from "@/features/vehicles/components/vehicles-table";

export default function FleetPage() {
  return (
    <RequireAccess module="fleet" moduleLabel="Fleet management">
      <div className="mx-auto w-full max-w-7xl py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Fleet Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your vehicle fleet. Add, edit, and track vehicle status.
          </p>
        </div>

        <VehiclesTable />
      </div>
    </RequireAccess>
  );
}
