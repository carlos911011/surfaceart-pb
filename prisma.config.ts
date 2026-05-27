import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl = process.env["DATABASE_URL"] ?? "file:./dev.db";
const authToken = process.env["TURSO_AUTH_TOKEN"];

// Embed auth token in URL for Turso/libsql when running prisma migrate deploy
const datasourceUrl =
  dbUrl.startsWith("libsql://") && authToken
    ? `${dbUrl}?authToken=${encodeURIComponent(authToken)}`
    : dbUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
