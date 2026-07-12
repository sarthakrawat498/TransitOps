"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { updateTripSchema, type UpdateTripInput } from "@/features/trips/schemas";
import type { TripBoardItem, TripOptions } from "@/features/trips/types";

function toNumberInputValue(value: number | null | undefined) {
  return value && value > 0 ? value : "";
}

export function TripEditDialog({
  item,
  options,
  isPending,
  onUpdate,
}: {
  item: TripBoardItem;
  options?: TripOptions;
  isPending: boolean;
  onUpdate: (id: string, input: UpdateTripInput) => Promise<void>;
}) {
  const trip = item.trip;
  const vehicleOptions = useMemo(
    () => [
      trip.vehicle,
      ...(options?.vehicles.filter((vehicle) => vehicle.id !== trip.vehicle.id) ?? []),
    ],
    [options?.vehicles, trip.vehicle],
  );
  const driverOptions = useMemo(
    () => [
      trip.driver,
      ...(options?.drivers.filter((driver) => driver.id !== trip.driver.id) ?? []),
    ],
    [options?.drivers, trip.driver],
  );

  const form = useForm<UpdateTripInput>({
    resolver: zodResolver(updateTripSchema) as Resolver<UpdateTripInput>,
    defaultValues: {
      source: trip.source,
      destination: trip.destination,
      vehicleId: trip.vehicle.id,
      driverId: trip.driver.id,
      cargoWeight: trip.cargoWeight,
      plannedDistance: trip.plannedDistance,
      revenue: trip.revenue,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await onUpdate(trip.id, values);
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
        Edit
      </DialogTrigger>
      <DialogContent className="border border-white/10 bg-popover text-popover-foreground sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Draft Trip</DialogTitle>
          <DialogDescription>
            Only draft trips can be edited. Dispatch and completed history stays immutable.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2" noValidate>
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-white/20 bg-card/70" />
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
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-white/20 bg-card/70" />
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
                  <FormLabel>Vehicle</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/20 bg-card/70">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-popover">
                      {vehicleOptions.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNumber}
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
                  <FormLabel>Driver</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full border-white/20 bg-card/70">
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-popover">
                      {driverOptions.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.fullName}
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
                  <FormLabel>Cargo Weight</FormLabel>
                  <FormControl>
                    <Input
                      ref={field.ref}
                      name={field.name}
                      type="number"
                      min="0"
                      value={toNumberInputValue(field.value)}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                      className="border-white/20 bg-card/70"
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
                  <FormLabel>Planned Distance</FormLabel>
                  <FormControl>
                    <Input
                      ref={field.ref}
                      name={field.name}
                      type="number"
                      min="0"
                      value={toNumberInputValue(field.value)}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                      className="border-white/20 bg-card/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="revenue"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Revenue</FormLabel>
                  <FormControl>
                    <Input
                      ref={field.ref}
                      name={field.name}
                      type="number"
                      min="0"
                      value={toNumberInputValue(field.value)}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === "" ? null : Number(event.target.value),
                        )
                      }
                      className="border-white/20 bg-card/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="sm:col-span-2" disabled={isPending}>
              {isPending ? "Saving..." : "Save Draft"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
