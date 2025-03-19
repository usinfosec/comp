"use server";

import { createOrganizationAndConnectUser } from "@/auth/org";
import { authActionClient } from "../safe-action";
import { organizationSchema } from "../schema";
import { tasks } from "@trigger.dev/sdk/v3";
import type { createOrganizationTask } from "@/jobs/tasks/organization/create-organization";

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
    const { name, website, frameworks } = parsedInput;
    const { id: userId } = ctx.user;

    if (!name || !website) {
      console.log("Invalid input detected:", { name, website });
      throw new Error("Invalid user input");
    }

    const newOrganization = await createOrganizationAndConnectUser({
      userId,
      normalizedEmail: ctx.user.email!,
      orgName: name,
    });

    try {
      const handle = await tasks.trigger<typeof createOrganizationTask>(
        "create-organization",
        {
          userId,
          fullName: name,
          website,
          frameworkIds: frameworks,
          organizationId: newOrganization.id,
        }
      );

      return {
        success: true,
        runId: handle.id,
        publicAccessToken: handle.publicAccessToken,
        newOrganization,
      };
    } catch (error) {
      console.error("Error during organization update:", error);

      throw new Error("Failed to update organization");
    }
  });
