import { PrismaClient } from "@prisma/client";
import { Pool as PgPool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Only import pg in a Node.js environment
  if (typeof window === "undefined") {
    const pool = new PgPool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  }

  throw new Error("Database adapter not configured for this environment");
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
