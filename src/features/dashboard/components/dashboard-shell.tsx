"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bus,
  ChevronDown,
  Fuel,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  User,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Fleet", href: "/fleet", icon: Truck },
  { label: "Drivers", href: "/drivers", icon: UsersRound },
  { label: "Trips", href: "#trips", icon: Bus },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Fuel & Expenses", href: "/fuel-expenses", icon: Fuel },
  { label: "Analytics", href: "#analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const displayName = user?.fullName ?? "Raven K.";
  const roleLabel = user?.role.name.replaceAll("_", " ") ?? "Dispatcher";
  const userEmail = user?.email ?? "user@transitops.dev";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen bg-[#101010]">
        <aside className="hidden w-48 shrink-0 border-r border-white/20 bg-sidebar px-2 py-4 text-sidebar-foreground lg:block">
          <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2">
            <span className="flex size-7 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-300">
              <ShieldCheck className="size-4" />
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight">TransitOps</span>
          </Link>

          <nav className="space-y-1" aria-label="Dashboard navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.href === "/dashboard" && pathname === "/dashboard") ||
                (item.href !== "/dashboard" &&
                  item.href !== "#" &&
                  !item.href.startsWith("#") &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "border border-orange-500/60 bg-orange-500/20 text-orange-100 shadow-[inset_3px_0_0_rgba(249,115,22,0.9)]",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/15 bg-background/95 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </button>

              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="h-9 border-white/15 bg-card/60 pl-9 text-sm"
                />
              </div>

              {/* User dropdown menu */}
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <Badge
                        variant="outline"
                        className="mt-1 border-sky-500/50 bg-sky-500/10 text-[10px] font-semibold uppercase tracking-wide text-sky-200"
                      >
                        {roleLabel}
                      </Badge>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-full border border-sky-500/40 bg-sky-500/15 text-xs font-semibold text-sky-100">
                      {user ? getInitials(displayName) : <UserRound className="size-4" />}
                    </div>
                    <ChevronDown className="hidden size-4 text-zinc-400 sm:block" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2">
                      <User className="size-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="size-4" />
                      <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-hidden p-4 sm:p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
