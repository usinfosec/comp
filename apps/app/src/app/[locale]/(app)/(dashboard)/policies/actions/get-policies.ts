"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import { appErrors, policiesInputSchema } from "../types";

export const getPolicies = authActionClient
  .schema(policiesInputSchema)
  .metadata({
    name: "get-policies",
    track: {
      event: "get-policies",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { search, status, page = 1, per_page = 10 } = parsedInput;
    const { user } = ctx;

    if (!user.organizationId) {
      return {
        success: false,
        error: appErrors.UNAUTHORIZED.message,
      };
    }

    try {
      const skip = (page - 1) * per_page;

      const [policies, total] = await Promise.all([
        db.organizationPolicy.findMany({
          where: {
            organizationId: user.organizationId,
            AND: [
              search
                ? {
                  policy: {
                    OR: [
                      { name: { contains: search, mode: "insensitive" } },
                      { description: { contains: search, mode: "insensitive" } },
                    ],
                  },
                }
                : {},
              status ? { status: status as any } : {},
            ],
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            policy: {
              select: {
                id: true,
                name: true,
                description: true,
                slug: true,
              },
            },
          },
          skip,
          take: per_page,
          orderBy: { updatedAt: 'desc' },
        }),
        db.organizationPolicy.count({
          where: {
            organizationId: user.organizationId,
            AND: [
              search
                ? {
                  policy: {
                    OR: [
                      { name: { contains: search, mode: "insensitive" } },
                      { description: { contains: search, mode: "insensitive" } },
                    ],
                  },
                }
                : {},
              status ? { status: status as any } : {},
            ],
          },
        }),
      ]);

      return {
        success: true,
        data: { policies, total },
      };
    } catch (error) {
      console.error("Error fetching policies:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR.message,
      };
    }
  });