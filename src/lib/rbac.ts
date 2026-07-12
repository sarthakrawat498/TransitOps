import type { RoleName } from "@/generated/prisma/enums";

export type ModuleKey =
  | "fleet"
  | "drivers"
  | "trips"
  | "maintenance"
  | "fuelAndExpenses"
  | "analytics"
  | "settings"
  | "dashboard";

export type PermissionLevel = "manage" | "view" | "none";

export const CLIENT_ROLE_PERMISSIONS: Record<RoleName, Record<ModuleKey, PermissionLevel>> = {
  SUPER_ADMIN: {
    fleet: "manage",
    drivers: "manage",
    trips: "manage",
    maintenance: "manage",
    fuelAndExpenses: "manage",
    analytics: "manage",
    settings: "manage",
    dashboard: "manage",
  },
  FLEET_MANAGER: {
    fleet: "manage",
    drivers: "manage",
    trips: "view",
    maintenance: "view",
    fuelAndExpenses: "view",
    analytics: "view",
    settings: "manage",
    dashboard: "view",
  },
  DRIVER: {
    fleet: "none",
    drivers: "none",
    trips: "view",
    maintenance: "none",
    fuelAndExpenses: "none",
    analytics: "none",
    settings: "view",
    dashboard: "view",
  },
  SAFETY_OFFICER: {
    fleet: "none",
    drivers: "manage",
    trips: "view",
    maintenance: "none",
    fuelAndExpenses: "none",
    analytics: "view",
    settings: "view",
    dashboard: "view",
  },
  FINANCIAL_ANALYST: {
    fleet: "view",
    drivers: "none",
    trips: "none",
    maintenance: "none",
    fuelAndExpenses: "manage",
    analytics: "manage",
    settings: "view",
    dashboard: "view",
  },
};

export function hasPermission(
  role: RoleName | undefined,
  module: ModuleKey,
  level: PermissionLevel,
): boolean {
  if (!role) return false;
  const permission = CLIENT_ROLE_PERMISSIONS[role][module];
  if (level === "none") return true;
  if (level === "view") return permission === "view" || permission === "manage";
  return permission === "manage";
}

export function canView(role: RoleName | undefined, module: ModuleKey): boolean {
  return hasPermission(role, module, "view");
}

export function canManage(role: RoleName | undefined, module: ModuleKey): boolean {
  return hasPermission(role, module, "manage");
}

export function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
