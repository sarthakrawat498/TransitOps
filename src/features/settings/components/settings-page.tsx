"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { settingsUpdateSchema } from "@/features/settings/schemas";
import type { SettingsAccessLevel, SettingsFormValues } from "@/features/settings/types";
import { useAuth } from "@/providers/auth-provider";

const SETTINGS_EDIT_ROLES = new Set(["SUPER_ADMIN", "FLEET_MANAGER"]);

function roleLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function accessLabel(value: SettingsAccessLevel): string {
  if (value === "manage") {
    return "✓";
  }

  if (value === "view") {
    return "view";
  }

  return "-";
}

export function SettingsPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useSettings();
  const updateMutation = useUpdateSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsUpdateSchema),
    defaultValues: {
      depotName: "",
      currency: "INR",
      distanceUnit: "kilometers",
    },
  });

  const canEdit = user ? SETTINGS_EDIT_ROLES.has(user.role.name) : false;

  useEffect(() => {
    if (!data?.general) {
      return;
    }

    form.reset({
      depotName: data.general.depotName,
      currency: data.general.currency as SettingsFormValues["currency"],
      distanceUnit: data.general.distanceUnit as SettingsFormValues["distanceUnit"],
    });
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Settings updated");
    } catch {
      toast.error("Failed to update settings");
    }
  });

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-7xl rounded-xl border border-white/10 bg-card/60 p-6">
        <h1 className="text-lg font-semibold">Settings unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unable to load settings right now. Please retry.
        </p>
        <Button className="mt-4" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <h1 className="sr-only">Settings and RBAC</h1>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="border border-white/10 bg-card/60">
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Depot identity and unit configuration.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                <FormField
                  control={form.control}
                  name="depotName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depot Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!canEdit || isLoading || updateMutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        disabled={!canEdit || isLoading || updateMutation.isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="INR">INR (Rs)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distanceUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance Unit</FormLabel>
                      <Select
                        disabled={!canEdit || isLoading || updateMutation.isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select distance unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kilometers">Kilometers</SelectItem>
                          <SelectItem value="miles">Miles</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={!canEdit || isLoading || updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save changes"}
                </Button>

                {!canEdit ? (
                  <p className="text-xs text-muted-foreground">
                    You can view settings, but only Fleet Manager and Super Admin can edit them.
                  </p>
                ) : null}
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-card/60">
          <CardHeader>
            <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
            <CardDescription>Reference access matrix for functional modules.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 py-2">Role</th>
                    <th className="px-2 py-2">Fleet</th>
                    <th className="px-2 py-2">Drivers</th>
                    <th className="px-2 py-2">Trips</th>
                    <th className="px-2 py-2">Fuel/Exp</th>
                    <th className="px-2 py-2">Analytics</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || !data?.accessMatrix ? (
                    <tr>
                      <td colSpan={6} className="px-2 py-6 text-center text-muted-foreground">
                        Loading RBAC matrix...
                      </td>
                    </tr>
                  ) : (
                    data.accessMatrix.map((item) => (
                      <tr key={item.role} className="border-b border-white/5 last:border-0">
                        <td className="px-2 py-2 font-medium">{roleLabel(item.role)}</td>
                        <td className="px-2 py-2">{accessLabel(item.fleet)}</td>
                        <td className="px-2 py-2">{accessLabel(item.drivers)}</td>
                        <td className="px-2 py-2">{accessLabel(item.trips)}</td>
                        <td className="px-2 py-2">{accessLabel(item.fuelAndExpenses)}</td>
                        <td className="px-2 py-2">{accessLabel(item.analytics)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
