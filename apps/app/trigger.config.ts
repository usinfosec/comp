import { PrismaInstrumentation } from "@prisma/instrumentation";
import { syncVercelEnvVars } from "@trigger.dev/build/extensions/core";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";
import { puppeteer } from "@trigger.dev/build/extensions/puppeteer";
import { defineConfig } from "@trigger.dev/sdk/v3";

const schemasBasePath = "../../packages/db/prisma/schema";

export default defineConfig({
  project: "proj_lhxjliiqgcdyqbgtucda",
  runtime: "node",
  logLevel: "log",
  instrumentations: [new PrismaInstrumentation()],
  maxDuration: 300, // 5 minutes
  build: {
    extensions: [
      prismaExtension({
        schema: `${schemasBasePath}/artifact.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/auth.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/comment.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/control.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/evidence.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/framework.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/integration.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/organization.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/policy.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/requirement.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/risk.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/schema.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/task.prisma`,
      }),
      prismaExtension({
        schema: `${schemasBasePath}/vendor.prisma`,
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
