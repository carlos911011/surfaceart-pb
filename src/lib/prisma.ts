import path from "path";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function resolveDbUrl(): string {
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  // libsql needs absolute file URLs; convert relative "file:./x" to absolute
  if (rawUrl.startsWith("file:") && !rawUrl.startsWith("file:/")) {
    const relativePath = rawUrl.slice("file:".length);
    const absolutePath = path.resolve(process.cwd(), relativePath);
    return `file:${absolutePath}`;
  }
  return rawUrl;
}

function createPrismaClient() {
  const config: { url: string; authToken?: string } = { url: resolveDbUrl() };
  if (process.env.TURSO_AUTH_TOKEN) config.authToken = process.env.TURSO_AUTH_TOKEN;
  const adapter = new PrismaLibSql(config);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
