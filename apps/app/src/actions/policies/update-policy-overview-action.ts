// update-policy-overview-action.ts

"use server";

import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { authActionClient } from "../safe-action";
import { updatePolicyOverviewSchema } from "../schema";

export const updatePolicyOverviewAction = authActionClient
  .schema(updatePolicyOverviewSchema)
  .metadata({
    name: "update-policy-overview",
    track: {
      event: "update-policy-overview",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { id, title, description, isRequiredToSign } = parsedInput;
    const { user } = ctx;

    if (!user) {
      return {
        success: false,
        error: "Not authorized",
      };
    }

    try {
      const policy = await db.organizationPolicy.findUnique({
        where: { id, organizationId: user.organizationId },
        include: {
          policy: true,
        },
      });

      if (!policy) {
        return {
          success: false,
          error: "Policy not found",
        };
      }

      await db.organizationPolicy.update({
        where: { id },
        data: {
          policy: {
            update: {
              name: title,
              description,
              // Use type assertion to handle the new field
              // that might not be in the generated types yet
              ...(isRequiredToSign !== undefined
                ? ({ isRequiredToSign: isRequiredToSign === "required" } as any)
                : {}),
            },
          },
        },
      });

      revalidatePath(`/${user.organizationId}/policies/all/${id}`);
      revalidatePath(`/${user.organizationId}/policies/all`);
      revalidatePath(`/${user.organizationId}/policies`);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update policy overview",
      };
    }
  });
