"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
__exportStar(require("@prisma/client"), exports);
exports.db = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.db;
