"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

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
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema } from "@/features/auth/schemas";

const roleValues = [
  "fleet-manager",
  "dispatcher",
  "safety-officer",
  "financial-analyst",
] as const;

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
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "dispatcher",
      rememberMe: false,
    },
  });

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
    <div className="relative z-10 w-full max-w-md animate-fade-in">
      {/* Glassmorphism card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 space-y-2 text-center">
          <h1 className="animate-slide-up stagger-1 text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="animate-slide-up stagger-2 text-sm text-zinc-400">
            Sign in to access your dashboard
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* Email field */}
            <div className="animate-slide-up stagger-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="you@transitops.in"
                        className="h-12 border-white/10 bg-white/5 text-zinc-100 transition-all duration-200 placeholder:text-zinc-500 focus:border-orange-500/50 focus:bg-white/10 focus:ring-orange-500/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password field with toggle */}
            <div className="animate-slide-up stagger-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="h-12 border-white/10 bg-white/5 pr-12 text-zinc-100 transition-all duration-200 placeholder:text-zinc-500 focus:border-orange-500/50 focus:bg-white/10 focus:ring-orange-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Role field */}
            <div className="animate-slide-up stagger-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Role (RBAC)
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-full border-white/10 bg-white/5 text-zinc-100 transition-all duration-200 data-placeholder:text-zinc-500 hover:bg-white/10">
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
            </div>

            {/* Remember me and forgot password */}
            <div className="animate-slide-up stagger-4 flex items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2.5 space-y-0">
                    <FormControl>
                      <input
                        ref={field.ref}
                        type="checkbox"
                        checked={field.value}
                        onBlur={field.onBlur}
                        onChange={(event) => field.onChange(event.target.checked)}
                        className="size-4 rounded border-white/20 bg-white/5 accent-orange-500 transition-colors focus:ring-orange-500/20"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal text-zinc-400">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <button
                type="button"
                className="text-sm text-zinc-400 transition-colors hover:text-orange-400"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <div className="animate-slide-up stagger-5 pt-2">
              <Button
                type="submit"
                className="h-12 w-full gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/40 disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" />
                    Sign In
                  </>
                )}
              </Button>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="animate-fade-in rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                <p className="font-medium">Authentication Failed</p>
                <p className="mt-1 text-red-400/80">{submitError}</p>
              </div>
            )}
          </form>
        </Form>

        {/* Demo credentials hint */}
        <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Demo Credentials
          </p>
          <div className="space-y-1 text-xs text-zinc-400">
            <p>
              <span className="text-zinc-500">Email:</span>{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-zinc-300">
                fleet@transitops.dev
              </code>
            </p>
            <p>
              <span className="text-zinc-500">Password:</span>{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-zinc-300">
                demo123
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
