import { prisma } from "@/lib/prisma";
import type { AuthUserRecord } from "@/server/modules/auth/auth.types";

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string): Promise<AuthUserRecord | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUserRecord(data: {
  email: string;
  hashedPassword: string;
  name?: string;
}): Promise<AuthUserRecord> {
  return prisma.user.create({
    data: {
      email: data.email,
      hashedPassword: data.hashedPassword,
      name: data.name,
    },
  });
}

export async function updateUserPasswordRecord(
  id: string,
  hashedPassword: string,
): Promise<AuthUserRecord> {
  return prisma.user.update({
    where: { id },
    data: { hashedPassword },
  });
}
