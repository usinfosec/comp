// update-organization-action.ts

"use server";

import { createOrganizationAndConnectUser } from "@/auth/org";
import type { createDefaultPoliciesTask } from "@/jobs/tasks/organization/create-default-policies";
import { db } from "@bubba/db";
import { tasks, wait } from "@trigger.dev/sdk/v3";
import { revalidateTag } from "next/cache";
import { authActionClient } from "../safe-action";
import { organizationSchema } from "../schema";
import { soc2Seed } from "../soc2-seed";

export const createOrganizationAction = authActionClient
  .schema(organizationSchema)
  .metadata({
    name: "create-organization",
    track: {
      event: "create-organization",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { name, website } = parsedInput;
    const { id: userId, organizationId } = ctx.user;

    if (!name || !website) {
      console.log("Invalid input detected:", { name, website });

      throw new Error("Invalid user input");
    }

    if (!organizationId) {
      await createOrganizationAndConnectUser({
        userId,
        normalizedEmail: ctx.user.email!,
      });
    }

    const organization = await db.organization.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    try {
      await db.$transaction(async () => {
        await db.organization.upsert({
          where: {
            id: organization.id,
          },
          update: {
            name,
            website,
          },
          create: {
            name,
            website,
          },
        });

        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            onboarded: true,
          },
        });
      });

      await soc2Seed({
        organizationId: organization.id,
      });

      await tasks.trigger<typeof createDefaultPoliciesTask>(
        "create-default-policies",
        {
          ownerId: userId,
          organizationId: organization.id,
          organizationName: name,
        },
      );

      revalidateTag(`user_${userId}`);
      revalidateTag(`organization_${organizationId}`);

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error during organization update:", error);
      throw new Error("Failed to update organization");
    }
  });
