import { LoginForm } from "@/features/auth/components/login-form";
import { Bus, Fuel, Shield, Truck, Users, Wrench } from "lucide-react";

const roleCards = [
  {
    title: "Fleet Manager",
    description: "Fleet & Maintenance",
    icon: Truck,
    gradient: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/30",
  },
  {
    title: "Dispatcher",
    description: "Dashboard & Trips",
    icon: Bus,
    gradient: "from-sky-500/20 to-blue-500/20",
    border: "border-sky-500/30",
  },
  {
    title: "Safety Officer",
    description: "Drivers & Compliance",
    icon: Shield,
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/30",
  },
  {
    title: "Financial Analyst",
    description: "Fuel, Expenses & Analytics",
    icon: Fuel,
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
  },
];

function FloatingShape({
  className,
  delay = "0s",
}: {
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 animate-float ${className}`}
      style={{ animationDelay: delay }}
    />
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full overflow-hidden">
      <div className="grid w-full grid-cols-1 lg:grid-cols-[45fr_55fr]">
        {/* Left branding panel with animated gradient */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-10 lg:flex">
          {/* Animated gradient overlay */}
          <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-sky-600/10" />

          {/* Floating decorative shapes */}
          <FloatingShape
            className="bg-orange-500 -top-20 -left-20 size-64"
            delay="0s"
          />
          <FloatingShape
            className="bg-sky-500 top-1/3 -right-32 size-80"
            delay="2s"
          />
          <FloatingShape
            className="bg-violet-500 -bottom-20 left-1/4 size-72"
            delay="4s"
          />
          <FloatingShape
            className="bg-emerald-500 bottom-1/3 -left-16 size-48"
            delay="1s"
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="mb-12 flex items-center gap-3">
              <div className="animate-pulse-glow flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-2xl font-bold text-white shadow-lg shadow-orange-500/25">
                TO
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  TransitOps
                </h1>
                <p className="text-sm text-zinc-400">
                  Fleet management, simplified.
                </p>
              </div>
            </div>

            {/* Hero text */}
            <div className="mb-12">
              <h2 className="mb-3 text-4xl font-bold leading-tight text-white">
                Streamline your
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  fleet operations
                </span>
              </h2>
              <p className="max-w-md text-lg text-zinc-400">
                One platform to manage vehicles, drivers, trips, maintenance,
                and expenses with role-based access control.
              </p>
            </div>
          </div>

          {/* Role cards */}
          <div className="relative z-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              One login, four roles
            </p>
            <div className="grid grid-cols-2 gap-3">
              {roleCards.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.title}
                    className={`group rounded-xl border bg-gradient-to-br p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${role.gradient} ${role.border}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="size-4 text-zinc-300" />
                      <span className="text-sm font-medium text-zinc-200">
                        {role.title}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{role.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
            <p className="text-xs text-zinc-500">
              TRANSITOPS © 2026 — RBAC ENABLED
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Users className="size-3.5" />
                <span>Drivers</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Truck className="size-3.5" />
                <span>Vehicles</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Wrench className="size-3.5" />
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel with form */}
        <div className="relative flex items-center justify-center bg-zinc-950 p-6 lg:p-10">
          {/* Subtle gradient background for right panel */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-zinc-950 to-zinc-900/50" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Mobile logo (shows on small screens) */}
          <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-lg font-bold text-white">
              TO
            </div>
            <span className="text-lg font-semibold text-white">TransitOps</span>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
