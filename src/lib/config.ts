import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("12h"),
  JWT_ISSUER: z.string().default("transitops-api"),
  JWT_AUDIENCE: z.string().default("transitops-web"),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  CORS_ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  AUTH_COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
  AUTH_COOKIE_SECURE: z.enum(["true", "false"]).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const flattened = parsedEnv.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(flattened)}`);
}

const env = parsedEnv.data;

const corsAllowedOrigins = env.CORS_ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const authCookieSecure = env.AUTH_COOKIE_SECURE
  ? env.AUTH_COOKIE_SECURE === "true"
  : env.NODE_ENV === "production";

export const config = {
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  jwtIssuer: env.JWT_ISSUER,
  jwtAudience: env.JWT_AUDIENCE,
  nextAuthUrl: env.NEXTAUTH_URL,
  nodeEnv: env.NODE_ENV,
  corsAllowedOrigins,
  authCookieSameSite: env.AUTH_COOKIE_SAMESITE,
  authCookieSecure,
} as const;
