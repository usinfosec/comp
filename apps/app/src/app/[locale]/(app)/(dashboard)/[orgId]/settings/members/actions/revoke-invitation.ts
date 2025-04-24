import type { ActionResponse } from "@/actions/actions";
import { appErrors } from "@/errors/app-error";
import { getOrgId } from "@/helpers/get-org-id";
import { getCurrentUser } from "@/helpers/session/get-current-user";
import { authClient } from "@/lib/auth";
import { tServer } from "@/lib/i18n";
import { z } from "zod";
import { createSafeActionClient } from "@/actions/actions";

const schema = z.object({
	invitationId: z.string(),
});

export const revokeInvitation = createSafeActionClient()
	.schema(schema)
	.action(async ({ parsedInput }): Promise<ActionResponse> => {
		try {
			const { invitationId } = parsedInput;
			const orgId = getOrgId();
			// ... existing code ...
		} catch (error) {
			// Handle error
		}
	});
