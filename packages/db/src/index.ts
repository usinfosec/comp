import { neonConfig } from "@neondatabase/serverless";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Only import and use ws in Node.js environment
if (!("WebSocket" in globalThis)) {
  const ws = require("ws");
  neonConfig.webSocketConstructor = ws;
}

neonConfig.useSecureWebSocket = true;

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  
  // Check if we're using Neon (connection string contains 'neon.tech')
  if (connectionString?.includes('neon.tech')) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    
    return new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  }
  
  // Use standard PrismaClient for local PostgreSQL
  return new PrismaClient({
    log: ["error", "warn"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export * from "@prisma/client";

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
