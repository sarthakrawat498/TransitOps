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
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
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
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === formValues.vehicleId);
  const selectedTrip = vehicleTrips.find((trip) => trip.id === formValues.tripId);

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
        className="min-w-28 bg-orange-500 text-orange-950 hover:bg-orange-400"
        onClick={() => {
          setFormValues(defaultValues);
          setOpen(true);
        }}
      >
        <Plus className="size-4" />
        Log Fuel
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-white/10 bg-[#151515] text-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Fuel</DialogTitle>
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
                <SelectTrigger className="h-10 w-full border-white/30 bg-white/10 text-foreground">
                  <span className={selectedVehicle ? undefined : "text-muted-foreground"}>
                    {selectedVehicle
                      ? `${selectedVehicle.registrationNumber} - ${selectedVehicle.model}`
                      : "Select vehicle"}
                  </span>
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
                <SelectTrigger className="h-10 w-full border-white/30 bg-white/10 text-foreground">
                  <span
                    className={
                      formValues.tripId === "none" || selectedTrip
                        ? undefined
                        : "text-muted-foreground"
                    }
                  >
                    {formValues.tripId === "none"
                      ? "No linked trip"
                      : (selectedTrip?.label ?? "Select trip")}
                  </span>
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
                  className="h-10 border-white/30 bg-white/10 text-foreground"
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
                  className="h-10 border-white/30 bg-white/10 text-foreground"
                  onChange={(event) => handleChange("cost", event.target.value)}
                />
              </FuelExpensesFormField>

              <FuelExpensesFormField label="Date">
                <Input
                  required
                  type="date"
                  value={formValues.logDate}
                  className="h-10 border-white/30 bg-white/10 text-foreground"
                  onChange={(event) => handleChange("logDate", event.target.value)}
                />
              </FuelExpensesFormField>
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createFuelLogMutation.isPending}>
                {createFuelLogMutation.isPending ? "Saving..." : "Save Fuel Log"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
