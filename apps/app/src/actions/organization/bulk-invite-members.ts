"use server";

import { authClient } from "@/utils/auth-client";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";
import type { ActionResponse } from "../types";

// --- Schemas for Validation ---
const emailSchema = z.string().email("Invalid email format");
const availableRoles = ["admin", "auditor", "employee"] as const;
type InviteRole = (typeof availableRoles)[number];

const manualInviteSchema = z.object({
	email: emailSchema,
	role: z.enum(availableRoles),
});
const manualInvitesSchema = z.array(manualInviteSchema);

// --- Result Type ---
interface BulkInviteResult {
	successfulInvites: number;
	failedItems: {
		input: { email: string; role: InviteRole };
		error: string;
	}[];
}

// --- Server Action (Accepts Array of Manual Invites) ---
export const bulkInviteMembers = authActionClient
	.metadata({
		name: "bulk-invite-members",
		track: {
			event: "bulk_invite_members",
			channel: "organization",
		},
	})
	.schema(manualInvitesSchema) // Validate the input array using Zod
	.action(
		async ({
			ctx,
			parsedInput,
		}): Promise<ActionResponse<BulkInviteResult>> => {
			// parsedInput is now the validated array: z.infer<typeof manualInvitesSchema>
			const organizationId = ctx.session.activeOrganizationId;

			if (!organizationId) {
				return { success: false, error: "Organization not found" };
			}

			const results: BulkInviteResult = {
				successfulInvites: 0,
				failedItems: [],
			};

			const manualInvites = parsedInput; // Use the validated input

			if (manualInvites.length === 0) {
				return { success: false, error: "No invites submitted." };
			}

			for (const invite of manualInvites) {
				try {
					// Email/Role already validated by Zod schema
					await authClient.organization.inviteMember(invite);
					results.successfulInvites += 1;
				} catch (error) {
					console.error(
						`Error inviting manual member ${invite.email}:`,
						error,
					);
					results.failedItems.push({
						input: invite,
						error:
							error instanceof Error
								? error.message
								: "Invite failed",
					});
				}
			}

			// Revalidate only if changes were made
			if (results.successfulInvites > 0) {
				revalidatePath(`/${organizationId}/settings/users`);
				revalidateTag(`user_${ctx.user.id}`);
			}

			// Determine overall success
			if (results.successfulInvites > 0) {
				return { success: true, data: results };
			}
			// All attempts failed, return error but include details
			return {
				success: false,
				error: "All invitations failed.",
				data: results,
			};
		},
	);
