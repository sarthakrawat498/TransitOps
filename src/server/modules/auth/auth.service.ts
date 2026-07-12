import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { RoleName } from "@/generated/prisma/enums";
import { config } from "@/lib/config";
import { InvalidCredentialsError, UserAlreadyExistsError } from "@/server/modules/auth/auth.errors";
import * as authReader from "@/server/modules/auth/auth.reader";
import type {
  AuthTokens,
  AuthUserRecord,
  LoginParams,
  SignupParams,
} from "@/server/modules/auth/auth.types";
import * as authWriter from "@/server/modules/auth/auth.writer";
import type { AuthUser } from "@/types";

function toPublicUser(user: AuthUserRecord): AuthUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: {
      id: user.role.id,
      name: user.role.name,
      description: user.role.description,
    },
  };
}

function issueToken(user: AuthUser): AuthTokens {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role.name,
    },
    config.jwtSecret,
    { expiresIn: "7d" },
  );

  return { accessToken };
}

export async function signup(
  params: SignupParams,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const existing = await authReader.getUserByEmail(params.email);
  if (existing) {
    throw new UserAlreadyExistsError();
  }

  const role = await authReader.getRoleByName(RoleName.DRIVER);
  if (!role) {
    throw new InvalidCredentialsError("Default signup role is not configured");
  }

  const user = await authWriter.createUser({
    ...params,
    roleId: role.id,
  });
  const publicUser = toPublicUser(user);
  const tokens = issueToken(publicUser);

  return { user: publicUser, tokens };
}

export async function login(params: LoginParams): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const user = await authReader.getUserByEmail(params.email);
  if (!user) {
    throw new InvalidCredentialsError();
  }

  if (!user.isActive) {
    throw new InvalidCredentialsError();
  }

  const isValid = await bcrypt.compare(params.password, user.hashedPassword);
  if (!isValid) {
    throw new InvalidCredentialsError();
  }

  const publicUser = toPublicUser(user);
  const tokens = issueToken(publicUser);

  return { user: publicUser, tokens };
}

export async function getCurrentUser(userId: string): Promise<AuthUser> {
  const user = await authReader.getUserById(userId);
  if (!user) {
    throw new InvalidCredentialsError("User not found");
  }

  return toPublicUser(user);
}
