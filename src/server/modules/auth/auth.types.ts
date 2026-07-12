import type { RoleName } from "@/generated/prisma/enums";

export interface LoginParams {
  email: string;
  password: string;
}

export interface SignupParams {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthTokens {
  accessToken: string;
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
