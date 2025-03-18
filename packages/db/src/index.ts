import { neonConfig } from "@neondatabase/serverless";
import { Pool as NeonPool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Ensure this only runs in a Node.js environment
if (typeof window === "undefined") {
  const ws = require("ws");
  neonConfig.webSocketConstructor = ws;
}

neonConfig.useSecureWebSocket = true;

const createPrismaClient = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Use Neon for serverless environments
  if (connectionString.includes("neon.tech")) {
    const pool = new NeonPool({ connectionString });
    const adapter = new PrismaNeon(pool);

    return new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  }

  // Only import pg in a Node.js environment
  if (typeof window === "undefined") {
    const { Pool: PgPool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");

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

export * from "@prisma/client";

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
