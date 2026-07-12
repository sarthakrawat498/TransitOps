import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { config } from "@/lib/config";
import { InvalidCredentialsError, UserAlreadyExistsError } from "@/server/modules/auth/auth.errors";
import * as authReader from "@/server/modules/auth/auth.reader";
import type { AuthTokens, LoginParams, SignupParams } from "@/server/modules/auth/auth.types";
import * as authWriter from "@/server/modules/auth/auth.writer";
import type { AuthUser } from "@/types";

function toPublicUser(user: { id: string; email: string; name: string | null }): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

function issueToken(user: AuthUser): AuthTokens {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    config.jwtSecret,
    { expiresIn: "7d" },
  );

  return { accessToken };
}

export async function signup(params: SignupParams): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const existing = await authReader.getUserByEmail(params.email);
  if (existing) {
    throw new UserAlreadyExistsError();
  }

  const user = await authWriter.createUser(params);
  const publicUser = toPublicUser(user);
  const tokens = issueToken(publicUser);

  return { user: publicUser, tokens };
}

export async function login(params: LoginParams): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const user = await authReader.getUserByEmail(params.email);
  if (!user) {
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
