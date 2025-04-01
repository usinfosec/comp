"use server";

import { db } from "@bubba/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types";
import { revalidatePath, revalidateTag } from "next/cache";
import { Role } from "@bubba/db/types";

const revokeInvitationSchema = z.object({
  invitationId: z.string(),
});

export const revokeInvitation = authActionClient
  .metadata({
    name: "revoke-invitation",
    track: {
      event: "revoke_invitation",
      channel: "organization",
    },
  })
  .schema(revokeInvitationSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }): Promise<ActionResponse<{ revoked: boolean }>> => {
      if (!ctx.session.activeOrganizationId) {
        return {
          success: false,
          error: "User does not have an organization",
        };
      }

      const { invitationId } = parsedInput;

      try {
        // Check if user has admin permissions
        const currentUserMember = await db.member.findFirst({
          where: {
            organizationId: ctx.session.activeOrganizationId,
            userId: ctx.user.id,
          },
        });

        if (!currentUserMember || currentUserMember.role !== Role.admin) {
          return {
            success: false,
            error: "You don't have permission to revoke invitations",
          };
        }

        // Check if the invitation exists in the organization
        const invitation = await db.invitation.findFirst({
          where: {
            id: invitationId,
            organizationId: ctx.session.activeOrganizationId,
            status: "pending",
          },
        });

        if (!invitation) {
          return {
            success: false,
            error: "Invitation not found or already accepted",
          };
        }

        // Revoke the invitation by deleting the invitation record
        await db.invitation.delete({
          where: {
            id: invitationId,
          },
        });

        revalidatePath("/settings/members");
        revalidateTag(`user_${ctx.user.id}`);

        return {
          success: true,
          data: { revoked: true },
        };
      } catch (error) {
        console.error("Error revoking invitation:", error);
        return {
          success: false,
          error: "Failed to revoke invitation",
        };
      }
    }
  );
