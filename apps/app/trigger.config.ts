import { PrismaInstrumentation } from "@prisma/instrumentation";
import { syncVercelEnvVars } from "@trigger.dev/build/extensions/core";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";
import { puppeteer } from "@trigger.dev/build/extensions/puppeteer";
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
	project: "proj_lhxjliiqgcdyqbgtucda",
	runtime: "node",
	logLevel: "log",
	instrumentations: [new PrismaInstrumentation()],
	maxDuration: 300, // 5 minutes
	build: {
		extensions: [
			prismaExtension({
				schema: "../../packages/db/prisma/schema/schema.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/comment.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/evidence.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/artifact.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/organization.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/policy.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/risk.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/task.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/vendor.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/auth.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/requirement.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/framework.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/integration.prisma",
			}),
			prismaExtension({
				schema: "../../packages/db/prisma/schema/control.prisma",
			}),
			puppeteer(),
			syncVercelEnvVars(),
		],
	},
	retries: {
		enabledInDev: true,
		default: {
			maxAttempts: 3,
			minTimeoutInMs: 1000,
			maxTimeoutInMs: 10000,
			factor: 2,
			randomize: true,
		},
	},
	dirs: ["./src/jobs", "./src/trigger"],
});
