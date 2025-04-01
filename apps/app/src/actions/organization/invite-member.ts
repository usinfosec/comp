"use server";

import { db } from "@bubba/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import { Departments, Role } from "@prisma/client";
import { sendEmail } from "@bubba/email/lib/resend";
import { InviteEmail } from "@bubba/email/emails/invite";
import { createHash } from "node:crypto";
import type { ActionResponse } from "../types";
import { revalidatePath, revalidateTag } from "next/cache";

const generateInviteCode = (email: string, organizationId: string) => {
  const randomSalt = crypto.randomUUID();

  return createHash("sha256")
    .update(`${email}:${organizationId}:${randomSalt}:${Date.now()}`)
    .digest("hex")
    .substring(0, 32);
};

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role).default(Role.admin),
  department: z.nativeEnum(Departments).default(Departments.none),
});

export const inviteMember = authActionClient
  .metadata({
    name: "invite-member",
    track: {
      event: "invite_member",
      channel: "organization",
    },
  })
  .schema(inviteMemberSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }): Promise<ActionResponse<{ invited: boolean }>> => {
      if (!ctx.session.activeOrganizationId) {
        return {
          success: false,
          error: "Organization not found",
        };
      }

      const { email, role, department } = parsedInput;

      try {
        // Check if user already exists in the system
        const existingUser = await db.user.findUnique({
          where: {
            email: email,
          },
        });

        // Check if the user is already a member of the organization
        const existingMember = await db.member.findFirst({
          where: {
            organizationId: ctx.session.activeOrganizationId,
            user: {
              email: email,
            },
          },
        });

        // Check for existing invitation
        const existingInvitation = await db.invitation.findFirst({
          where: {
            organizationId: ctx.session.activeOrganizationId,
            email: email,
          },
        });

        const inviteCode = generateInviteCode(
          email,
          ctx.session.activeOrganizationId
        );

        if (existingMember) {
          return {
            success: false,
            error: "User is already a member of this organization",
          };
        }

        if (existingInvitation) {
          // Update existing invitation if it exists
          await db.invitation.update({
            where: {
              id: existingInvitation.id,
            },
            data: {
              role,
              status: "pending",
              expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
            },
          });
        } else {
          // Create new invitation
          // We need to create a user record if one doesn't exist yet
          let userId = existingUser?.id;

          if (!userId) {
            // Create a temporary user record
            const newUser = await db.user.create({
              data: {
                id: crypto.randomUUID(),
                email: email,
                name: email.split("@")[0],
                createdAt: new Date(),
                updatedAt: new Date(),
                emailVerified: true,
              },
            });
            userId = newUser.id;
          }

          // Create the invitation record
          await db.invitation.create({
            data: {
              email: email,
              role: role,
              status: "pending",
              expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
              organizationId: ctx.session.activeOrganizationId,
              inviterId: ctx.user.id,
            },
          });
        }

        const organization = await db.organization.findUnique({
          where: {
            id: ctx.session.activeOrganizationId,
          },
          select: {
            name: true,
          },
        });

        await sendEmail({
          to: email,
          subject: `You've been invited to join ${organization?.name || "an organization"} on Comp AI`,
          react: InviteEmail({
            email: email,
            teamName: organization?.name || "Team",
            inviteCode,
            invitedByEmail: ctx.user.email || undefined,
            invitedByName: ctx.user.name || undefined,
          }),
        });

        revalidatePath("/settings/members");
        revalidateTag(`user_${ctx.user.id}`);

        return {
          success: true,
          data: { invited: true },
        };
      } catch (error) {
        console.error("Error inviting member:", error);
        return {
          success: false,
          error: "Failed to invite member",
        };
      }
    }
  );
