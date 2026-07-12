"use client";

import { DriversTable } from "@/features/drivers/components/drivers-table";

export default function DriversPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your drivers. Track license status, safety scores, and availability.
        </p>
      </div>

      <DriversTable />
    </div>
  );
}
