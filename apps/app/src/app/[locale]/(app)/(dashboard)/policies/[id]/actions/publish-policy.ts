"use server";

import { authActionClient } from "@/actions/safe-action";
import { type OrganizationPolicy, db } from "@bubba/db";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

export type PublishPolicyResponse = {
  success: boolean;
  data?: OrganizationPolicy;
  error?: string;
};

export const publishPolicy = authActionClient
  .schema(schema)
  .metadata({
    name: "publish-policy",
    track: {
      event: "publish-policy",
      channel: "server",
    },
  })
  .action(async ({ ctx, parsedInput }) => {
    const { user } = ctx;
    const { id } = parsedInput;

    if (!user.organizationId) {
      return {
        success: false,
        error: "Not authorized - no organization found",
      };
    }

    const policy = await db.organizationPolicy.findFirst({
      where: {
        policyId: id,
        organizationId: user.organizationId!,
      },
      select: {
        id: true,
      },
    });

    if (!policy?.id) {
      return {
        success: false,
        error: "Policy not found",
      };
    }

    try {
      const organizationPolicy = await db.organizationPolicy.update({
        where: {
          id: policy.id,
          organizationId: user.organizationId!,
        },
        data: {
          status: "published",
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        data: organizationPolicy,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to publish policy",
      };
    }
  });
