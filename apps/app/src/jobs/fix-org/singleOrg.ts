import { db } from "@comp/db";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { performCheckAndFixMissingItems } from "../../app/[locale]/(internal)/internal/fix-org/actions/check-missing-items";

// NOTE: This System User ID is a placeholder.
// const SYSTEM_USER_ID = "system-fix-org"; // No longer used

const fixSingleOrgPayloadSchema = z.object({
	organizationId: z.string(),
});

// NOTE: Persistent linter errors might indicate an issue with SDK version,
// TS config, or type definitions in this environment.
export const fixSingleOrgTask = schemaTask({
	id: "fix-single-org",
	schema: fixSingleOrgPayloadSchema,
	run: async (payload, { ctx }) => {
		const { organizationId } = payload;

		logger.info(
			`Starting missing items check for organization: ${organizationId}`,
			{
				organizationId,
			},
		);

		try {
			// Fetch the oldest member of the organization using the 'Member' model
			const oldestMember = await db.member.findFirst({
				where: { organizationId },
				orderBy: { createdAt: "asc" },
				select: { userId: true },
			});

			if (!oldestMember?.userId) {
				logger.error(
					`No members found for organization ${organizationId}. Skipping fix.`,
					{
						organizationId,
					},
				);
				return {
					success: false,
					error: `No members found for organization ${organizationId}.`,
				};
			}

			const actingUserId = oldestMember.userId;
			logger.info(`Using user ID: ${actingUserId} for organization fix.`);

			const result = await performCheckAndFixMissingItems(
				organizationId,
				actingUserId, // Use the fetched user ID
				db,
			);

			logger.info(
				`Completed missing items check for organization: ${organizationId}`,
				{
					organizationId,
					result,
				},
			);

			return { success: true, result };
		} catch (error) {
			logger.error(
				`Error checking missing items for organization: ${organizationId}`,
				{
					organizationId,
					error:
						error instanceof Error ? error.message : String(error),
				},
			);

			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});
