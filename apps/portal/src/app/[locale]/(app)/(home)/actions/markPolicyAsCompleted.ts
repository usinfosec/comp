"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import { z } from "zod";
import { logger } from "@/utils/logger";
import { revalidatePath } from "next/cache";

export const markPolicyAsCompleted = authActionClient
  .schema(z.object({ policyId: z.string() }))
  .metadata({
    name: "markPolicyAsCompleted",
    track: {
      event: "markPolicyAsCompleted",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { policyId } = parsedInput;
    const { user } = ctx;

    logger("markPolicyAsCompleted action started", {
      policyId,
      userId: user?.id,
    });

    if (!user) {
      logger("Unauthorized attempt to mark policy as completed", { policyId });
      throw new Error("Unauthorized");
    }

    const organizationPolicy = await db.organizationPolicy.findUnique({
      where: {
        id: policyId,
      },
    });

    if (!organizationPolicy) {
      logger("Policy not found", { policyId });
      throw new Error("Policy not found");
    }

    // Check if user has already signed this policy
    if (organizationPolicy.signedBy.includes(user.id)) {
      logger("User has already signed this policy", {
        policyId,
        userId: user.id,
      });
      return organizationPolicy;
    }

    logger("Updating policy signature", { policyId, userId: user.id });
    const completedPolicy = await db.organizationPolicy.update({
      where: { id: policyId },
      data: {
        signedBy: [...organizationPolicy.signedBy, user.id],
      },
    });

    logger("Policy successfully marked as completed", {
      policyId,
      userId: user.id,
    });

    revalidatePath("/");

    return completedPolicy;
  });
