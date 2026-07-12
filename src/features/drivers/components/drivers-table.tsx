"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
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

import { useDrivers } from "@/features/drivers/hooks/use-drivers";
import { useDeleteDriver } from "@/features/drivers/hooks/use-delete-driver";
import type { Driver } from "@/features/drivers/services/drivers.service";
import { DriverFormDialog } from "./driver-form-dialog";
import { DeleteDriverDialog } from "./delete-driver-dialog";

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-green-500/20 text-green-400 border-green-500/30",
  ON_TRIP: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  OFF_DUTY: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  SUSPENDED: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabels: Record<string, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isLicenseExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

function isLicenseExpiringSoon(dateStr: string): boolean {
  const expiryDate = new Date(dateStr);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
}

export function DriversTable() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [deleteDriver, setDeleteDriver] = useState<Driver | null>(null);

  const { data, isLoading, error } = useDrivers({
    status: statusFilter as "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED" | undefined,
    page,
    limit: 20,
  });

  const deleteMutation = useDeleteDriver();

  const handleDelete = async () => {
    if (!deleteDriver) return;

    try {
      await deleteMutation.mutateAsync(deleteDriver.id);
      await queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver deleted successfully");
      setDeleteDriver(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete driver";
      toast.error(message);
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["drivers"] });
    setCreateOpen(false);
    setEditDriver(null);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        Failed to load drivers. Please try again.
      </div>
    );
  }

  const drivers = data?.data?.drivers ?? [];
  const meta = data?.data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter ?? "all"}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? undefined : value);
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
              <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>License Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>License Expiry</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-center">Safety Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.fullName}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.licenseCategory}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {formatDate(driver.licenseExpiry)}
                      {isLicenseExpired(driver.licenseExpiry) && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          Expired
                        </Badge>
                      )}
                      {isLicenseExpiringSoon(driver.licenseExpiry) && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{driver.contactNumber}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        driver.safetyScore >= 90
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : driver.safetyScore >= 70
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {driver.safetyScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[driver.status]}>
                      {statusLabels[driver.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setEditDriver(driver)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleteDriver(driver)}
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
            Showing {drivers.length} of {meta.total} drivers
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

      <DriverFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleSuccess}
      />

      <DriverFormDialog
        open={!!editDriver}
        onOpenChange={(open) => !open && setEditDriver(null)}
        driver={editDriver}
        onSuccess={handleSuccess}
      />

      <DeleteDriverDialog
        open={!!deleteDriver}
        onOpenChange={(open) => !open && setDeleteDriver(null)}
        driver={deleteDriver}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
