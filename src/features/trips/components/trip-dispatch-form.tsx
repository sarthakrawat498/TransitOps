"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTripSchema, type CreateTripInput } from "@/features/trips/schemas";
import type { TripOptions } from "@/features/trips/types";

const defaultValues: CreateTripInput = {
  source: "",
  destination: "",
  vehicleId: "",
  driverId: "",
  cargoWeight: 0,
  plannedDistance: 0,
};

function toNumberInputValue(value: number | undefined) {
  return value && value > 0 ? value : "";
}

export function TripDispatchForm({
  options,
  isLoading,
  isPending,
  onDispatch,
}: {
  options?: TripOptions;
  isLoading: boolean;
  isPending: boolean;
  onDispatch: (input: CreateTripInput) => Promise<void>;
}) {
  const form = useForm<CreateTripInput>({
    resolver: zodResolver(createTripSchema) as Resolver<CreateTripInput>,
    defaultValues,
  });

  const selectedVehicleId = useWatch({ control: form.control, name: "vehicleId" });
  const watchedCargoWeight = useWatch({ control: form.control, name: "cargoWeight" });
  const cargoWeight = Number(watchedCargoWeight ?? 0);
  const selectedVehicle = useMemo(
    () => options?.vehicles.find((vehicle) => vehicle.id === selectedVehicleId),
    [options?.vehicles, selectedVehicleId],
  );
  const capacityExceeded = Boolean(
    selectedVehicle && cargoWeight > selectedVehicle.maxLoadCapacity,
  );
  const hasNoOptions = !isLoading && (!options?.vehicles.length || !options?.drivers.length);

  const onSubmit = form.handleSubmit(async (values) => {
    if (capacityExceeded) {
      toast.error("Cargo weight exceeds vehicle capacity");
      return;
    }

    await onDispatch(values);
    form.reset(defaultValues);
  });

  return (
    <section className="space-y-3" aria-labelledby="create-trip-heading">
      <h2
        id="create-trip-heading"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Create Trip
      </h2>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Source
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Gandhinagar Depot"
                    className="h-9 border-white/20 bg-card/70 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Destination
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ahmedabad Hub"
                    className="h-9 border-white/20 bg-card/70 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Vehicle Available Only
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-9 w-full border-white/20 bg-card/70 text-sm">
                      <SelectValue
                        placeholder={isLoading ? "Loading vehicles..." : "Select vehicle"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-white/10 bg-popover">
                    {options?.vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.registrationNumber} - {vehicle.maxLoadCapacity.toLocaleString()} kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="driverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Driver Available Only
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-9 w-full border-white/20 bg-card/70 text-sm">
                      <SelectValue
                        placeholder={isLoading ? "Loading drivers..." : "Select driver"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-white/10 bg-popover">
                    {options?.drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.fullName} - {driver.licenseCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cargoWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Cargo Weight (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    ref={field.ref}
                    name={field.name}
                    type="number"
                    min="0"
                    value={toNumberInputValue(field.value)}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                    placeholder="700"
                    className="h-9 border-white/20 bg-card/70 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plannedDistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Planned Distance (km)
                </FormLabel>
                <FormControl>
                  <Input
                    ref={field.ref}
                    name={field.name}
                    type="number"
                    min="0"
                    value={toNumberInputValue(field.value)}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                    placeholder="32"
                    className="h-9 border-white/20 bg-card/70 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {capacityExceeded && selectedVehicle ? (
            <div className="rounded-lg border border-rose-500/60 bg-rose-500/10 p-3 text-xs text-rose-100">
              <p>Vehicle Capacity: {selectedVehicle.maxLoadCapacity.toLocaleString()} kg</p>
              <p>Cargo Weight: {cargoWeight.toLocaleString()} kg</p>
              <p className="mt-1 font-semibold">
                Capacity exceeded by{" "}
                {(cargoWeight - selectedVehicle.maxLoadCapacity).toLocaleString()} kg
              </p>
            </div>
          ) : null}

          {hasNoOptions ? (
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100">
              No available vehicle or driver can be dispatched right now.
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              type="submit"
              disabled={isPending || capacityExceeded || hasNoOptions}
              className="h-9"
            >
              {capacityExceeded || hasNoOptions
                ? "Dispatch (disabled)"
                : isPending
                  ? "Dispatching..."
                  : "Dispatch"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-9"
              onClick={() => form.reset(defaultValues)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
