"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import { z } from "zod";

export const getOrganizationEvidenceTasks = authActionClient
  .schema(
    z.object({
      search: z.string().optional().nullable(),
    })
  )
  .metadata({
    name: "getOrganizationEvidenceTasks",
    track: {
      event: "get-organization-evidence-tasks",
      channel: "server",
    },
  })
  .action(async ({ ctx, parsedInput }) => {
    const { user } = ctx;
    const { search } = parsedInput;

    if (!user.organizationId) {
      return {
        success: false,
        error: "Not authorized - no organization found",
      };
    }

    try {
      const evidenceTasks = await db.organizationEvidence.findMany({
        where: {
          organizationId: user.organizationId,
          ...(search
            ? {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    evidence: {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                ],
              }
            : {}),
        },
        include: {
          evidence: true,
        },
      });

      return {
        success: true,
        data: evidenceTasks,
      };
    } catch (error) {
      console.error("Error fetching evidence tasks:", error);
      return {
        success: false,
        error: "Failed to fetch evidence tasks",
      };
    }
  });
