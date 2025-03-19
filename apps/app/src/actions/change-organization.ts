"use server";

import { authActionClient } from "./safe-action";
import { z } from "zod";
import { db } from "@bubba/db";

export const changeOrganizationAction = authActionClient
  .schema(
    z.object({
      organizationId: z.string(),
    })
  )
  .metadata({
    name: "change-organization",
    track: {
      event: "create-employee",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = parsedInput;
    const { user } = ctx;

    try {
      const organization = await db.organization.findUnique({
        where: {
          id: organizationId,
        },
      });

      if (!organization) {
        return {
          success: false,
          error: "Organization not found",
        };
      }

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          organizationId: organization.id,
        },
      });

      return {
        success: true,
        data: organization,
      };
    } catch (error) {
      console.error("Error changing organization:", error);

      return {
        success: false,
        error: "Failed to change organization",
      };
    }
  });
