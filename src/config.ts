import type { MigrationConfig } from "drizzle-orm/migrator";

export type DBConfig = {
  url: string,
  migConfig: MigrationConfig,
}

export type APIConfig = {
  fileserverHits: number
  port: number
  platform: string
  secret: string
  polkaAPIKey: string
}

export type Config = {
  api: APIConfig;
  db: DBConfig;
};

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

process.loadEnvFile();
const dbURL = envOrThrow("DB_URL")
const migConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations"
}

const dbConfig = {
  url: dbURL,
  migConfig: migConfig
}

const apiConfig: APIConfig = {
  fileserverHits: 0,
  port: Number(envOrThrow("PORT")),
  platform: envOrThrow("PLATFORM"),
  secret: envOrThrow("SECRET"),
  polkaAPIKey: envOrThrow("POLKA_KEY")
}

export const config: Config = {
    api: apiConfig,
    db: dbConfig,
};