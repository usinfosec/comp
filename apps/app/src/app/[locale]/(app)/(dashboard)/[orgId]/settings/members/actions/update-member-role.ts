"use server";

import { revalidatePath } from "next/cache";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

import type { ActionResponse } from "@/actions/actions";
import { appErrors } from "@/errors/app-error";
import { getOrgId } from "@/helpers/get-org-id";
import { getCurrentUser } from "@/helpers/session/get-current-user";
import { authClient } from "@/lib/auth";
import { tServer } from "@/lib/i18n";

const schema = z.object({
	memberId: z.string(),
	role: z.string(),
});

export const updateMemberRole = createSafeActionClient()
	.schema(schema)
	.action(async ({ parsedInput }): Promise<ActionResponse> => {
		try {
			const { memberId, role } = parsedInput;
			const orgId = getOrgId();
			const user = await getCurrentUser();

			if (!user || !user.id) {
				return {
					success: false,
					error: appErrors.NOT_AUTHORIZED_ERROR,
				};
			}

			const { error } =
				await authClient.organizations.updateOrganizationMembership({
					organizationId: orgId,
					userId: memberId,
					role,
					requestingUserId: user.id,
				});

			if (error) {
				console.error("Error updating member role:", error);
				return { success: false, error: appErrors.UNEXPECTED_ERROR };
			}

			revalidatePath(`/${orgId}/settings/members`);

			return {
				success: true,
				message: tServer("members.actions.updateMemberRole.success"),
			};
		} catch (error) {
			console.error("Error updating member role:", error);
			return { success: false, error: appErrors.UNEXPECTED_ERROR };
		}
	});
