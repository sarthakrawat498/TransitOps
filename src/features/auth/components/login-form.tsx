"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";

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

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await mutateAsync(values);
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
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
        <CardDescription>Access your TransitOps dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute inset-y-0 right-2 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {submitError ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {submitError}
              </div>
            ) : null}
          </form>
        </Form>

        <div className="mt-6 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">Demo credentials</p>
          <p>
            <span className="text-muted-foreground">Email:</span>{" "}
            <code className="rounded bg-background px-1.5 py-0.5 font-mono">
              admin@transitops.dev
            </code>
          </p>
          <p>
            <span className="text-muted-foreground">Password:</span>{" "}
            <code className="rounded bg-background px-1.5 py-0.5 font-mono">password123</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
