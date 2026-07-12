import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
