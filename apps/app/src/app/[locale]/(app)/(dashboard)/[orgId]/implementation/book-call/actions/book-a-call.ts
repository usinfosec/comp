"use server";

import { z } from "zod";
import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import ky from "ky";

export const bookCallAction = authActionClient
	.schema(
		z.object({
			frameworks: z.array(z.string()),
			role: z.string(),
			employeeCount: z.string(),
			lookingFor: z.string(),
			timeline: z.string(),
		}),
	)
	.metadata({
		name: "book-call",
	})
	.action(
		async ({
			parsedInput: {
				frameworks,
				role,
				employeeCount,
				lookingFor,
				timeline,
			},
			ctx: { session },
		}) => {
			try {
				const { activeOrganizationId } = session;

				if (!activeOrganizationId) {
					return {
						success: false,
						error: "Not authorized",
					};
				}

				const bookingDetails = {
					frameworks,
					role,
					employeeCount,
					lookingFor,
					timeline,
				};

				await db.onboarding.upsert({
					where: {
						organizationId: activeOrganizationId,
					},
					create: {
						callBooked: true,
						organizationId: activeOrganizationId,
						companyBookingDetails: bookingDetails,
					},
					update: {
						callBooked: true,
						companyBookingDetails: bookingDetails,
					},
				});

				return {
					success: true,
				};
			} catch (error) {
				console.error("Error in bookCallAction:", error);

				return {
					success: false,
					error: {
						message:
							error instanceof Error
								? error.message
								: "An unexpected error occurred.",
					},
				};
			}
		},
	);
