"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}
const createPrismaClient = () => {
    let connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined");
    }
    if (process.env.NODE_ENV === "production") {
        connectionString = process.env.DATABASE_POOL_URL ?? connectionString;
        const params = new URL(connectionString);
        params.searchParams.set("connection_limit", "190");
        connectionString = params.toString();
    }
    // Only import pg in a Node.js environment
    if (typeof window === "undefined") {
        const pool = new pg_1.Pool({ connectionString });
        const adapter = new adapter_pg_1.PrismaPg(pool);
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
