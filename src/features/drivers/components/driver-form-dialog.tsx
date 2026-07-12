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

import { useCreateDriver } from "@/features/drivers/hooks/use-create-driver";
import { useUpdateDriver } from "@/features/drivers/hooks/use-update-driver";
import type { Driver } from "@/features/drivers/services/drivers.service";
import type { CreateDriverInput } from "@/features/drivers/schemas";
import { DriverForm } from "./driver-form";

interface DriverFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver?: Driver | null;
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

export function DriverFormDialog({
  open,
  onOpenChange,
  driver,
  onSuccess,
}: DriverFormDialogProps) {
  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: CreateDriverInput) => {
    try {
      if (driver) {
        const { licenseNumber: _, ...updateValues } = values;
        await updateMutation.mutateAsync({ id: driver.id, input: updateValues });
        toast.success("Driver updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Driver created successfully");
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
          <DialogTitle>{driver ? "Edit Driver" : "Add Driver"}</DialogTitle>
          <DialogDescription>
            {driver
              ? "Update the driver details below."
              : "Enter the details for the new driver."}
          </DialogDescription>
        </DialogHeader>
        <DriverForm
          driver={driver}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
