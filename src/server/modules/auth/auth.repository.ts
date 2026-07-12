import { prisma } from "@/lib/prisma";
import type { RoleName } from "@/generated/prisma/enums";
import type { AuthUserRecord } from "@/server/modules/auth/auth.types";

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  return prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
}

export async function findUserById(id: string): Promise<AuthUserRecord | null> {
  return prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
}

export async function findRoleByName(name: RoleName) {
  return prisma.role.findUnique({ where: { name } });
}

export async function createUserRecord(data: {
  email: string;
  hashedPassword: string;
  fullName: string;
  roleId: string;
}): Promise<AuthUserRecord> {
  return prisma.user.create({
    data: {
      email: data.email,
      hashedPassword: data.hashedPassword,
      fullName: data.fullName,
      roleId: data.roleId,
    },
    include: { role: true },
  });
}

export async function updateUserPasswordRecord(
  id: string,
  hashedPassword: string,
): Promise<AuthUserRecord> {
  return prisma.user.update({
    where: { id },
    data: { hashedPassword },
    include: { role: true },
  });
}
