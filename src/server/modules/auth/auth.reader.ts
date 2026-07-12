import type { RoleName } from "@/generated/prisma/enums";
import type { AuthUserRecord } from "@/server/modules/auth/auth.types";
import * as authRepository from "@/server/modules/auth/auth.repository";

export async function getUserByEmail(email: string): Promise<AuthUserRecord | null> {
  return authRepository.findUserByEmail(email);
}

export async function getUserById(id: string): Promise<AuthUserRecord | null> {
  return authRepository.findUserById(id);
}

export async function getRoleByName(name: RoleName) {
  return authRepository.findRoleByName(name);
}
