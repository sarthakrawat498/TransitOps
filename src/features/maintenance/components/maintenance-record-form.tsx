"use client";

import axios from "axios";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useCreateMaintenanceLog } from "@/features/maintenance/hooks/use-create-maintenance-log";
import type { MaintenanceVehicleOption } from "@/features/maintenance/types";

interface MaintenanceRecordFormProps {
  vehicles: MaintenanceVehicleOption[];
}

interface MaintenanceFormValues {
  vehicleId: string;
  service: string;
  cost: string;
  startedAt: string;
  status: "OPEN" | "CLOSED";
}

const statusLabels: Record<MaintenanceFormValues["status"], string> = {
  OPEN: "In Shop",
  CLOSED: "Completed",
};

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function getDefaultFormValues(vehicles: MaintenanceVehicleOption[]): MaintenanceFormValues {
  return {
    vehicleId: vehicles[0]?.id ?? "",
    service: "",
    cost: "",
    startedAt: todayInputValue(),
    status: "OPEN",
  };
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return "Unable to save maintenance log.";
}

export function MaintenanceRecordForm({ vehicles }: MaintenanceRecordFormProps) {
  const defaultValues = useMemo(() => getDefaultFormValues(vehicles), [vehicles]);
  const [formValues, setFormValues] = useState<MaintenanceFormValues>(defaultValues);
  const createMaintenanceLogMutation = useCreateMaintenanceLog();
  const effectiveVehicleId = formValues.vehicleId || defaultValues.vehicleId;
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === effectiveVehicleId);

  const handleChange = (key: keyof MaintenanceFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!effectiveVehicleId) {
      toast.error("Please select a vehicle before saving maintenance.");
      return;
    }

    try {
      await createMaintenanceLogMutation.mutateAsync({
        vehicleId: effectiveVehicleId,
        service: formValues.service,
        cost: Number(formValues.cost),
        startedAt: new Date(`${formValues.startedAt}T00:00:00`),
        status: formValues.status,
      });
      toast.success("Maintenance log saved");
      setFormValues(getDefaultFormValues(vehicles));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <section className="space-y-3" aria-labelledby="service-record-heading">
      <h2
        id="service-record-heading"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Log Service Record
      </h2>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="space-y-1.5">
          <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Vehicle
          </span>
          <Select
            value={effectiveVehicleId}
            onValueChange={(value) => {
              if (value) {
                handleChange("vehicleId", value);
              }
            }}
          >
            <SelectTrigger className="h-10 w-full border-white/30 bg-white/10 text-foreground">
              <span className={selectedVehicle ? undefined : "text-muted-foreground"}>
                {selectedVehicle?.registrationNumber ?? "Select vehicle"}
              </span>
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.registrationNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-1.5">
          <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Service Type
          </span>
          <Input
            required
            value={formValues.service}
            className="h-10 border-white/30 bg-white/10 text-foreground"
            placeholder="Oil Change"
            onChange={(event) => handleChange("service", event.target.value)}
          />
        </label>

        <label className="space-y-1.5">
          <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Cost
          </span>
          <Input
            required
            min="0"
            step="1"
            type="number"
            inputMode="numeric"
            value={formValues.cost}
            className="h-10 border-white/30 bg-white/10 text-foreground"
            placeholder="2500"
            onChange={(event) => handleChange("cost", event.target.value.replace(/\D/g, ""))}
          />
        </label>

        <label className="space-y-1.5">
          <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Date
          </span>
          <Input
            required
            type="date"
            value={formValues.startedAt}
            className="h-10 border-white/30 bg-white/10 text-foreground"
            onChange={(event) => handleChange("startedAt", event.target.value)}
          />
        </label>

        <label className="space-y-1.5">
          <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </span>
          <Select
            value={formValues.status}
            onValueChange={(value) => {
              if (value === "OPEN" || value === "CLOSED") {
                handleChange("status", value);
              }
            }}
          >
            <SelectTrigger className="h-10 w-full border-white/30 bg-white/10 text-foreground">
              <span>{statusLabels[formValues.status]}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">In Shop</SelectItem>
              <SelectItem value="CLOSED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <Button
          type="submit"
          className="mt-2 h-10 w-full bg-orange-500 text-orange-950 hover:bg-orange-400"
          disabled={createMaintenanceLogMutation.isPending}
        >
          {createMaintenanceLogMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </form>

      <div className="space-y-2 pt-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="min-w-16 text-lime-400">Available</span>
          <span className="h-px flex-1 bg-white/40" />
          <span className="text-orange-400">In Shop</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="min-w-16 text-orange-400">In Shop</span>
          <span className="h-px flex-1 bg-white/40" />
          <span className="text-lime-400">Available</span>
        </div>
        <p className="text-orange-300">
          Note: In Shop vehicles are removed from the dispatch pool.
        </p>
      </div>
    </section>
  );
}
