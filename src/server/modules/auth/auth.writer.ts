import bcrypt from "bcryptjs";

import type { AuthUserRecord } from "@/server/modules/auth/auth.types";
import * as authRepository from "@/server/modules/auth/auth.repository";

const SALT_ROUNDS = 10;

export async function createUser(data: {
  email: string;
  password: string;
  fullName: string;
  roleId: string;
}): Promise<AuthUserRecord> {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return authRepository.createUserRecord({
    email: data.email,
    hashedPassword,
    fullName: data.fullName,
    roleId: data.roleId,
  });
}

export async function updatePassword(userId: string, password: string): Promise<AuthUserRecord> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return authRepository.updateUserPasswordRecord(userId, hashedPassword);
}
