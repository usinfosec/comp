"use server";

import type { ActionResponse } from "@/actions/types";
import { auth } from "@/auth";
import { db } from "@bubba/db";

export const getApiKeysAction = async (): Promise<
	ActionResponse<
		{
			id: string;
			name: string;
			createdAt: string;
			expiresAt: string | null;
			lastUsedAt: string | null;
			isActive: boolean;
		}[]
	>
> => {
	try {
		const session = await auth();

		if (!session?.user.organizationId) {
			return {
				success: false,
				error: {
					code: "UNAUTHORIZED",
					message: "You must be logged in to perform this action",
				},
			};
		}

		const apiKeys = await db.apiKey.findMany({
			where: {
				organizationId: session.user.organizationId,
				isActive: true,
			},
			select: {
				id: true,
				name: true,
				createdAt: true,
				expiresAt: true,
				lastUsedAt: true,
				isActive: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return {
			success: true,
			data: apiKeys.map((key) => ({
				...key,
				createdAt: key.createdAt.toISOString(),
				expiresAt: key.expiresAt ? key.expiresAt.toISOString() : null,
				lastUsedAt: key.lastUsedAt ? key.lastUsedAt.toISOString() : null,
			})),
		};
	} catch (error) {
		console.error("Error fetching API keys:", error);
		return {
			success: false,
			error: {
				code: "INTERNAL_ERROR",
				message: "An error occurred while fetching API keys",
			},
		};
	}
};
