import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="dark relative flex min-h-screen w-full bg-background text-foreground">
      <div className="grid w-full grid-cols-1 lg:grid-cols-[45fr_55fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-card px-10 py-12 lg:flex">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">TransitOps</h1>
              <p className="text-sm text-muted-foreground">Fleet operations platform</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Manage vehicles, drivers, and trips from a single control plane.
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Role-based access, live dispatch, maintenance, fuel, and expense tracking - unified for
              operations teams.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <RolePill title="Fleet Manager" description="Fleet & maintenance" />
            <RolePill title="Safety Officer" description="Drivers & compliance" />
            <RolePill title="Financial Analyst" description="Fuel, expenses, analytics" />
            <RolePill title="Super Admin" description="Full platform control" />
          </div>

          <p className="text-xs text-muted-foreground">TransitOps &copy; 2026</p>
        </aside>

        <section className="flex items-center justify-center bg-background px-6 py-12 lg:px-10">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}

function RolePill({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-background/60 px-3 py-2">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
