"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useVehicles } from "@/features/vehicles/hooks/use-vehicles";
import { useDeleteVehicle } from "@/features/vehicles/hooks/use-delete-vehicle";
import type { Vehicle } from "@/features/vehicles/services/vehicles.service";
import { VehicleFormDialog } from "./vehicle-form-dialog";
import { DeleteVehicleDialog } from "./delete-vehicle-dialog";

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-green-500/20 text-green-400 border-green-500/30",
  ON_TRIP: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  IN_SHOP: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  RETIRED: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabels: Record<string, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function VehiclesTable() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);

  const { data, isLoading, error } = useVehicles({
    status: statusFilter as "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED" | undefined,
    page,
    limit: 20,
  });

  const deleteMutation = useDeleteVehicle();

  const handleDelete = async () => {
    if (!deleteVehicle) return;

    try {
      await deleteMutation.mutateAsync(deleteVehicle.id);
      await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted successfully");
      setDeleteVehicle(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete vehicle";
      toast.error(message);
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    setCreateOpen(false);
    setEditVehicle(null);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        Failed to load vehicles. Please try again.
      </div>
    );
  }

  const vehicles = data?.data?.vehicles ?? [];
  const meta = data?.data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter ?? "all"}
            onValueChange={(value) => {
              setStatusFilter(!value || value === "all" ? undefined : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="ON_TRIP">On Trip</SelectItem>
              <SelectItem value="IN_SHOP">In Shop</SelectItem>
              <SelectItem value="RETIRED">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Capacity (kg)</TableHead>
              <TableHead className="text-right">Odometer (km)</TableHead>
              <TableHead className="text-right">Acq. Cost</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(vehicle.maxLoadCapacity)}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(vehicle.odometer)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(vehicle.acquisitionCost)}
                  </TableCell>
                  <TableCell>{vehicle.region ?? "-"}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[vehicle.status]}>
                      {statusLabels[vehicle.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setEditVehicle(vehicle)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleteVehicle(vehicle)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {vehicles.length} of {meta.total} vehicles
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <VehicleFormDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleSuccess} />

      <VehicleFormDialog
        open={!!editVehicle}
        onOpenChange={(open) => !open && setEditVehicle(null)}
        vehicle={editVehicle}
        onSuccess={handleSuccess}
      />

      <DeleteVehicleDialog
        open={!!deleteVehicle}
        onOpenChange={(open) => !open && setDeleteVehicle(null)}
        vehicle={deleteVehicle}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
