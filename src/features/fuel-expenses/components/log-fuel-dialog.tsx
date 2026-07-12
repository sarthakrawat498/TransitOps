"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FuelExpensesFormField } from "@/features/fuel-expenses/components/fuel-expenses-form-field";
import { getFuelExpensesFormError } from "@/features/fuel-expenses/components/form-errors";
import { useCreateFuelLog } from "@/features/fuel-expenses/hooks/use-create-fuel-log";
import type {
  FuelExpenseTripOption,
  FuelExpenseVehicleOption,
} from "@/features/fuel-expenses/types";

interface LogFuelDialogProps {
  vehicles: FuelExpenseVehicleOption[];
  trips: FuelExpenseTripOption[];
}

interface FuelLogFormValues {
  vehicleId: string;
  tripId: string;
  liters: string;
  cost: string;
  logDate: string;
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function getDefaultFormValues(vehicles: FuelExpenseVehicleOption[]): FuelLogFormValues {
  return {
    vehicleId: vehicles[0]?.id ?? "",
    tripId: "none",
    liters: "",
    cost: "",
    logDate: todayInputValue(),
  };
}

export function LogFuelDialog({ vehicles, trips }: LogFuelDialogProps) {
  const [open, setOpen] = useState(false);
  const defaultValues = useMemo(() => getDefaultFormValues(vehicles), [vehicles]);
  const [formValues, setFormValues] = useState<FuelLogFormValues>(defaultValues);
  const createFuelLogMutation = useCreateFuelLog();

  const vehicleTrips = trips.filter((trip) => trip.vehicleId === formValues.vehicleId);

  const handleChange = (key: keyof FuelLogFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
      ...(key === "vehicleId" ? { tripId: "none" } : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.vehicleId) {
      toast.error("Please select a vehicle before logging fuel.");
      return;
    }

    try {
      await createFuelLogMutation.mutateAsync({
        vehicleId: formValues.vehicleId,
        tripId: formValues.tripId === "none" ? undefined : formValues.tripId,
        liters: Number(formValues.liters),
        cost: Number(formValues.cost),
        logDate: new Date(`${formValues.logDate}T00:00:00`),
      });
      toast.success("Fuel log added");
      setOpen(false);
    } catch (error) {
      toast.error(getFuelExpensesFormError(error, "Unable to add fuel log."));
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setFormValues(defaultValues);
          setOpen(true);
        }}
      >
        <Plus className="mr-1 size-4" />
        Log fuel
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log fuel</DialogTitle>
            <DialogDescription>
              Add a fuel entry for a vehicle and optionally link it to a trip.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FuelExpensesFormField label="Vehicle">
              <Select
                value={formValues.vehicleId}
                onValueChange={(value) => {
                  if (value) {
                    handleChange("vehicleId", value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber} - {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FuelExpensesFormField>

            <FuelExpensesFormField label="Trip" helpText="Optional. Trips are filtered by vehicle.">
              <Select
                value={formValues.tripId}
                onValueChange={(value) => {
                  if (value) {
                    handleChange("tripId", value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select trip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked trip</SelectItem>
                  {vehicleTrips.map((trip) => (
                    <SelectItem key={trip.id} value={trip.id}>
                      {trip.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FuelExpensesFormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <FuelExpensesFormField label="Liters">
                <Input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={formValues.liters}
                  onChange={(event) => handleChange("liters", event.target.value)}
                />
              </FuelExpensesFormField>

              <FuelExpensesFormField label="Cost">
                <Input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  value={formValues.cost}
                  onChange={(event) => handleChange("cost", event.target.value)}
                />
              </FuelExpensesFormField>

              <FuelExpensesFormField label="Date">
                <Input
                  required
                  type="date"
                  value={formValues.logDate}
                  onChange={(event) => handleChange("logDate", event.target.value)}
                />
              </FuelExpensesFormField>
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createFuelLogMutation.isPending}>
                {createFuelLogMutation.isPending ? "Saving..." : "Save fuel log"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
