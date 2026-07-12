"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useSearch } from "@/providers/search-provider";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, matchExact: true },
  { label: "Fleet", href: "/fleet", icon: Truck },
  { label: "Drivers", href: "/drivers", icon: UsersRound },
  { label: "Trips", href: "/trips", icon: Bus },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Fuel & Expenses", href: "/fuel-expenses", icon: Fuel },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
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

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { query, setQuery } = useSearch();
  const displayName = user?.fullName ?? "Guest";
  const roleLabel = user ? formatRole(user.role.name) : "Signed out";
  const userEmail = user?.email ?? "";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dark h-screen bg-background text-foreground">
      <div className="flex h-full">
        <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-border/60 bg-sidebar px-3 py-4 lg:flex">
          <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-1">
            <span className="flex size-8 items-center justify-center rounded-md border border-border/60 bg-background text-foreground">
              <ShieldCheck className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">TransitOps</span>
          </Link>

          <nav className="flex flex-col gap-0.5" aria-label="Dashboard navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.matchExact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
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
          <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </button>

              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search this page..."
                  className="h-9 pl-9 text-sm"
                />
              </div>

              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px] font-medium">
                        {roleLabel}
                      </Badge>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold">
                      {user ? getInitials(displayName) : <UserRound className="size-4" />}
                    </div>
                    <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        {userEmail ? (
                          <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                        ) : null}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => router.push("/dashboard/profile")}
                    >
                      <User className="size-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => router.push("/dashboard/settings")}
                    >
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-destructive focus:text-destructive"
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

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
