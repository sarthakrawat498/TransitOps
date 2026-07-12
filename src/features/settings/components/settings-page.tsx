"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Minus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function AccessCell({ level }: { level: SettingsAccessLevel }) {
  if (level === "manage") {
    return (
      <Badge variant="secondary" className="gap-1 font-normal">
        <Check className="size-3" /> Manage
      </Badge>
    );
  }

  if (level === "view") {
    return (
      <Badge variant="outline" className="font-normal text-muted-foreground">
        View
      </Badge>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <Minus className="size-3" />
    </span>
  );
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
      <div className="mx-auto w-full max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Settings unavailable</CardTitle>
            <CardDescription>Unable to load settings right now. Please retry.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage operational defaults and review role-based access.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Depot identity and unit configuration.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-5" onSubmit={onSubmit} noValidate>
                <FormField
                  control={form.control}
                  name="depotName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depot name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!canEdit || isLoading || updateMutation.isPending}
                        />
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
                      <FormLabel>Distance unit</FormLabel>
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

                <div className="flex items-center gap-3 pt-1">
                  <Button
                    type="submit"
                    disabled={!canEdit || isLoading || updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Saving..." : "Save changes"}
                  </Button>
                  {!canEdit ? (
                    <p className="text-xs text-muted-foreground">
                      View-only. Only Fleet Manager and Super Admin can edit.
                    </p>
                  ) : null}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role-based access control</CardTitle>
            <CardDescription>Reference access matrix for functional modules.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Fleet</th>
                    <th className="px-3 py-2 font-medium">Drivers</th>
                    <th className="px-3 py-2 font-medium">Trips</th>
                    <th className="px-3 py-2 font-medium">Maintenance</th>
                    <th className="px-3 py-2 font-medium">Fuel/Exp</th>
                    <th className="px-3 py-2 font-medium">Analytics</th>
                    <th className="px-3 py-2 font-medium">Settings</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || !data?.accessMatrix ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                        Loading matrix...
                      </td>
                    </tr>
                  ) : (
                    data.accessMatrix.map((item) => (
                      <tr key={item.role} className="border-b last:border-0">
                        <td className="px-3 py-3 font-medium">{roleLabel(item.role)}</td>
                        <td className="px-3 py-3">
                          <AccessCell level={item.fleet} />
                        </td>
                        <td className="px-3 py-3">
                          <AccessCell level={item.drivers} />
                        </td>
                        <td className="px-3 py-3">
                          <AccessCell level={item.trips} />
                        </td>
                        <td className="px-3 py-3">
                          <AccessCell level={item.maintenance} />
                        </td>
                        <td className="px-3 py-3">
                          <AccessCell level={item.fuelAndExpenses} />
                        </td>
                        <td className="px-3 py-3">
                          <AccessCell level={item.analytics} />
                        </td>
                        <td className="px-3 py-3">
                          <AccessCell level={item.settings} />
                        </td>
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
