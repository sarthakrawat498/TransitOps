import { RoleName } from "@/generated/prisma/enums";

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

export const ALL_ROLES: readonly RoleName[] = Object.values(RoleName);

const rolePermissions: Record<RoleName, Record<ModuleKey, PermissionLevel>> = {
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

export function getRolePermission(role: RoleName, module: ModuleKey): PermissionLevel {
  return rolePermissions[role][module];
}

export function getRolesWithAtLeast(module: ModuleKey, level: PermissionLevel): RoleName[] {
  return ALL_ROLES.filter((role) => {
    const permission = rolePermissions[role][module];
    if (level === "none") return true;
    if (level === "view") return permission === "view" || permission === "manage";
    return permission === "manage";
  });
}

export function getReadRoles(module: ModuleKey): readonly RoleName[] {
  return getRolesWithAtLeast(module, "view");
}

export function getWriteRoles(module: ModuleKey): readonly RoleName[] {
  return getRolesWithAtLeast(module, "manage");
}

export function getRoleMatrix() {
  return rolePermissions;
}
