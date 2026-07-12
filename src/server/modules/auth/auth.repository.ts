import { prisma } from "@/lib/prisma";
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
