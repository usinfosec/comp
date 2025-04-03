"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { auth } from "@comp/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";

export const login = createSafeActionClient()
	.schema(
		z.object({
			otp: z.string(),
			email: z.string().email(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { user } = await auth.api.signInEmailOTP({
			body: {
				email: parsedInput.email,
				otp: parsedInput.otp,
			},
		});

		console.log({ user });

		console.log(`Getting member for user ${user.id}`);
		const member = await db.member.findFirst({
			where: {
				userId: user.id,
				role: "employee",
			},
		});

		if (!member) {
			throw new Error("Member not found");
		}

		console.log(`Setting active organization to ${member.organizationId}`);
		auth.api.setActiveOrganization({
			headers: await headers(),
			body: {
				organizationId: member.organizationId,
			},
		});

		return {
			success: true,
		};
	});
