"use client";

import { toast } from "sonner";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateVehicle } from "@/features/vehicles/hooks/use-create-vehicle";
import { useUpdateVehicle } from "@/features/vehicles/hooks/use-update-vehicle";
import type { Vehicle } from "@/features/vehicles/services/vehicles.service";
import type { CreateVehicleInput } from "@/features/vehicles/schemas";
import { VehicleForm } from "./vehicle-form";

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onSuccess: () => void;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return "An error occurred. Please try again.";
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  vehicle,
  onSuccess,
}: VehicleFormDialogProps) {
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: CreateVehicleInput) => {
    try {
      if (vehicle) {
        const { registrationNumber: _, ...updateValues } = values;
        await updateMutation.mutateAsync({ id: vehicle.id, input: updateValues });
        toast.success("Vehicle updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Vehicle created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
          <DialogDescription>
            {vehicle
              ? "Update the vehicle details below."
              : "Enter the details for the new vehicle."}
          </DialogDescription>
        </DialogHeader>
        <VehicleForm
          vehicle={vehicle}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
