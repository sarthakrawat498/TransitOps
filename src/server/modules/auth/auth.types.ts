export interface LoginParams {
  email: string;
  password: string;
}

export interface SignupParams {
  email: string;
  password: string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthUserRecord {
  id: string;
  email: string;
  name: string | null;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}
