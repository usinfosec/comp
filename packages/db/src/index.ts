"use server";

import { neonConfig } from "@neondatabase/serverless";
import { Pool as NeonPool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool as PgPool } from 'pg';

// Only import and use ws in Node.js environment
if (!("WebSocket" in globalThis)) {
  const ws = require("ws");
  neonConfig.webSocketConstructor = ws;
}

neonConfig.useSecureWebSocket = true;

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }
  
  // Use Neon-specific setup for neon.tech connections
  if (connectionString.includes('neon.tech')) {
    const pool = new NeonPool({ connectionString });
    const adapter = new PrismaNeon(pool);
    
    return new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  }
  
  // Use standard Postgres pool for non-Neon connections
  const pool = new PgPool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export * from "@prisma/client";

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
