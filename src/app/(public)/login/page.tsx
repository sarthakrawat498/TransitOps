import { LoginForm } from "@/features/auth/components/login-form";

const roleList = [
  "Fleet Manager — Fleet, Maintenance",
  "Dispatcher — Dashboard, Trips",
  "Safety Officer — Drivers, Compliance",
  "Financial Analyst — Fuel & Expenses, Analytics",
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full">
      <div className="grid w-full grid-cols-1 md:grid-cols-[42fr_58fr]">
        {/* Left branding panel - desktop only */}
        <div className="hidden flex-col justify-between bg-zinc-100 p-10 md:flex">
          <div>
            <div className="mb-8 flex size-12 items-center justify-center rounded-lg bg-zinc-900 text-xl font-bold text-white">
              TO
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">TransitOps</h1>
            <p className="mt-2 text-zinc-600">Fleet management, simplified.</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-zinc-700">One login, four roles:</p>
            <ul className="space-y-2 text-sm text-zinc-600">
              {roleList.map((role) => (
                <li key={role}>• {role}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-zinc-500">TRANSITOPS © 2026 — RBAC ENABLED</p>
        </div>

        {/* Right dark panel with form */}
        <div className="flex items-center justify-center bg-zinc-900 p-6 md:p-10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
