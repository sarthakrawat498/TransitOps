function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
  nextAuthUrl: optionalEnv("NEXTAUTH_URL", "http://localhost:3000"),
  nodeEnv: optionalEnv("NODE_ENV", "development"),
} as const;
