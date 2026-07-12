"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema } from "@/features/auth/schemas";

const roleValues = ["fleet-manager", "dispatcher", "safety-officer", "financial-analyst"] as const;

const roleOptions = [
  { value: roleValues[0], label: "Fleet Manager" },
  { value: roleValues[1], label: "Dispatcher" },
  { value: roleValues[2], label: "Safety Officer" },
  { value: roleValues[3], label: "Financial Analyst" },
] as const;

const loginFormSchema = loginSchema.extend({
  role: z.enum(roleValues, {
    message: "Please select a role",
  }),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return "Unable to sign in. Please verify your credentials and try again.";
}

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useLogin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "dispatcher",
      rememberMe: false,
    },
  });

  const accessBlurb = useMemo(
    () => [
      "Fleet Manager - Fleet, Maintenance",
      "Dispatcher - Dashboard, Trips",
      "Safety Officer - Drivers, Compliance",
      "Financial Analyst - Fuel and Expenses, Analytics",
    ],
    [],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await mutateAsync({
        email: values.email,
        password: values.password,
      });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Signed in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  });

  return (
    <div className="relative w-full max-w-md">
      <div className="mb-8 space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Sign in to your account</h1>
        <p className="text-sm text-zinc-400">Enter your credentials to continue</p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wide text-zinc-400">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="you@transitops.in"
                    className="h-11 border-zinc-700 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wide text-zinc-400">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-11 border-zinc-700 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wide text-zinc-400">Role (RBAC)</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full border-zinc-700 bg-zinc-950/60 text-zinc-100 data-placeholder:text-zinc-500">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      ref={field.ref}
                      type="checkbox"
                      checked={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="size-4 rounded border-border/70 bg-background/60 accent-foreground"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal text-zinc-400">Remember me</FormLabel>
                </FormItem>
              )}
            />

            <Link href="#" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="h-11 w-full text-sm font-medium" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>

          <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-400">
            <p className="mb-2 font-medium text-zinc-300">Access is scoped by role after login:</p>
            <ul className="space-y-1">
              {accessBlurb.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </form>
      </Form>

      {submitError ? (
        <aside className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive md:absolute md:top-36 md:-right-56 md:mt-0 md:w-52">
          <p className="font-medium">Error state</p>
          <p className="mt-1">{submitError}</p>
        </aside>
      ) : null}
    </div>
  );
}
