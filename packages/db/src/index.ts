import { PrismaClient } from "@prisma/client";
import { generateIdExtension } from "./extensions/generate-id-extension";

const createPrismaClient = () => {
	return new PrismaClient({
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
		log: ["error", "warn"],
	}).$extends(generateIdExtension);
};

const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
