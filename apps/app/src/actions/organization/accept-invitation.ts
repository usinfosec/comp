"use server";

import { db } from "@bubba/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";
import type { ActionResponse } from "../types";

async function validateInviteCode(inviteCode: string, invitedEmail: string) {
  const pendingInvitation = await db.organizationMember.findFirst({
    where: {
      accepted: false,
      invitedEmail,
      inviteCode,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return pendingInvitation;
}

const completeInvitationSchema = z.object({
  inviteCode: z.string(),
});

export const completeInvitation = authActionClient
  .metadata({
    name: "complete-invitation",
    track: {
      event: "complete_invitation",
      channel: "organization",
    },
  })
  .schema(completeInvitationSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }): Promise<
      ActionResponse<{
        accepted: boolean;
        organizationId: string;
      }>
    > => {
      const { inviteCode } = parsedInput;
      const user = ctx.user;

      if (!user || !user.email) {
        throw new Error("Unauthorized");
      }

      try {
        const invitation = await validateInviteCode(inviteCode, user.email);

        if (!invitation) {
          throw new Error("Invitation either used or expired");
        }

        const existingMembership = await db.organizationMember.findFirst({
          where: {
            userId: user.id,
            organizationId: invitation.organizationId,
          },
        });

        if (existingMembership) {
          if (user.organizationId !== invitation.organizationId) {
            await db.user.update({
              where: { id: user.id },
              data: {
                organizationId: invitation.organizationId,
              },
            });

            await db.organizationMember.update({
              where: { id: existingMembership.id },
              data: {
                accepted: true,
                invitedEmail: null,
                inviteCode: null,
              },
            });
          }

          return {
            success: true,
            data: {
              accepted: true,
              organizationId: invitation.organizationId,
            },
          };
        }

        await db.organizationMember.update({
          where: {
            id: invitation.id,
          },
          data: {
            accepted: true,
            userId: user.id,
            invitedEmail: null,
            inviteCode: null,
          },
        });

        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            organizationId: invitation.organizationId,
          },
        });

        revalidatePath(`/${invitation.organization.id}`);
        revalidatePath(`/${invitation.organization.id}/settings/members`);
        revalidateTag(`user_${user.id}`);

        return {
          success: true,
          data: {
            accepted: true,
            organizationId: invitation.organizationId,
          },
        };
      } catch (error) {
        console.error("Error accepting invitation:", error);
        throw new Error(error as string);
      }
    }
  );
