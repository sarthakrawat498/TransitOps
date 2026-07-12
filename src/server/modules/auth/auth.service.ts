import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { config } from "@/lib/config";
import { InvalidCredentialsError } from "@/server/modules/auth/auth.errors";
import * as authReader from "@/server/modules/auth/auth.reader";
import type {
  AuthTokens,
  AuthUserRecord,
  JwtTokenPayload,
  LoginResult,
  LoginParams,
} from "@/server/modules/auth/auth.types";
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
  const payload: JwtTokenPayload = {
    sub: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role.name,
  };
  const signOptions: SignOptions = {
    algorithm: "HS256",
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
    issuer: config.jwtIssuer,
    audience: config.jwtAudience,
  };
  const accessToken = jwt.sign(payload, config.jwtSecret, signOptions);

  return { accessToken };
}

export async function login(params: LoginParams): Promise<LoginResult> {
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
  if (!user || !user.isActive) {
    throw new InvalidCredentialsError("Invalid session");
  }

  return toPublicUser(user);
}
