"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const serverless_1 = require("@neondatabase/serverless");
const serverless_2 = require("@neondatabase/serverless");
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("@prisma/client");
// Ensure this only runs in a Node.js environment
if (typeof window === "undefined") {
    const ws = require("ws");
    serverless_1.neonConfig.webSocketConstructor = ws;
}
serverless_1.neonConfig.useSecureWebSocket = true;
const createPrismaClient = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined");
    }
    // Use Neon for serverless environments
    if (connectionString.includes("neon.tech")) {
        const pool = new serverless_2.Pool({ connectionString });
        const adapter = new adapter_neon_1.PrismaNeon(pool);
        return new client_1.PrismaClient({
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
        return new client_1.PrismaClient({
            adapter,
            log: ["error", "warn"],
        });
    }
    throw new Error("Database adapter not configured for this environment");
};
const globalForPrisma = globalThis;
exports.db = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.db;
