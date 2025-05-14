// custom-domain-action.ts

"use server";

import { db } from "@comp/db";
import { authActionClient } from "@/actions/safe-action";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

const customDomainSchema = z.object({
	domain: z.string().min(1),
});

export const customDomainAction = authActionClient
	.schema(customDomainSchema)
	.metadata({
		name: "custom-domain",
		track: {
			event: "add-custom-domain",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { domain } = parsedInput;
		const { activeOrganizationId } = ctx.session;

		if (!activeOrganizationId) {
			throw new Error("No active organization");
		}

		try {
			const currentDomain = await db.trust.findUnique({
				where: { organizationId: activeOrganizationId },
			});

			// Always set domainVerified to false when domain changes
			const domainVerified =
				currentDomain?.domain === domain
					? currentDomain.domainVerified
					: false;

			await db.trust.upsert({
				where: { organizationId: activeOrganizationId },
				update: { domain, domainVerified },
				create: {
					organizationId: activeOrganizationId,
					domain,
					domainVerified: false,
				},
			});

			revalidatePath(`/${activeOrganizationId}/settings/trust-portal`);
			revalidateTag(`organization_${activeOrganizationId}`);

			return {
				success: true,
				needsVerification: !domainVerified,
			};
		} catch (error) {
			console.error(error);
			throw new Error("Failed to update custom domain");
		}
	});
