"use server";

import { authActionClient } from "@/actions/safe-action";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { steps } from "../lib/constants";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const onboardOrganizationSchema = z.object({
	legalName: z.string(),
	website: z.string().url(),
	identity: z.string(),
	laptopAndMobileDevices: z.string(),
	techStack: z.string(),
	hosting: z.string(),
	vendors: z.string(),
	team: z.string(),
	data: z.string(),
});

export const onboardOrganization = authActionClient
	.schema(onboardOrganizationSchema)
	.metadata({
		name: "onboard-organization",
		track: {
			event: "onboard-organization",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		try {
			const session = await auth.api.getSession({
				headers: await headers(),
			});

			if (!session?.session?.activeOrganizationId) {
				return {
					success: false,
					error: "Not authorized - no active organization found.",
				};
			}

			const orgId = session.session.activeOrganizationId;

			await db.organization.update({
				where: {
					id: orgId,
				},
				data: {
					onboarding: {
						update: {
							completed: true,
						},
					},
					context: {
						create: steps.map((step) => ({
							question: step.question,
							answer: parsedInput[
								step.key as keyof typeof parsedInput
							],
							tags: ["onboarding"],
						})),
					},
				},
			});

			revalidatePath(`/${orgId}`);

			return {
				success: true,
			};
		} catch (error) {
			console.error("Error during organization creation/update:", error);

			throw new Error(
				"Failed to create or update organization structure",
			);
		}
	});
