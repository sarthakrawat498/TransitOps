import type { RoleName } from "@/generated/prisma/enums";

export interface LoginParams {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface JwtTokenPayload {
  sub: string;
  email: string;
  fullName: string;
  role: RoleName;
}

export interface LoginResult {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: {
      id: string;
      name: RoleName;
      description: string | null;
    };
  };
  tokens: AuthTokens;
}

export interface AuthUserRecord {
  id: string;
  roleId: string;
  email: string;
  fullName: string;
  hashedPassword: string;
  isActive: boolean;
  role: {
    id: string;
    name: RoleName;
    description: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}
