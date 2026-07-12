"use client";

import { VehiclesTable } from "@/features/vehicles/components/vehicles-table";

export default function FleetPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your vehicle fleet. Add, edit, and track vehicle status.
        </p>
      </div>

      <VehiclesTable />
    </div>
  );
}
