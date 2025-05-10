import { db } from "@comp/db";
import { cache } from "react";

export const findOrganization = cache(async (subdomain: string) => {
	const organization = await db.organization.findFirst({
		where: { slug: subdomain },
	});

	const isPublished = await db.trust.findFirst({
		where: { organizationId: organization?.id, status: "published" },
	});

	if (!organization || !isPublished) {
		return null;
	}

	return {
		...organization,
	};
});

export const getPublishedPolicies = cache(async (organizationId: string) => {
	const policies = await db.policy.findMany({
		where: { organizationId, status: "published" },
	});

	return policies;
});

export const getPublishedPolicy = cache(
	async (organizationId: string, policyId: string) => {
		const policy = await db.policy.findFirst({
			where: { organizationId, status: "published", id: policyId },
		});

		return policy;
	},
);

export const getPublishedControls = cache(async (organizationId: string) => {
	const controls = await db.task.findMany({
		where: { organizationId, status: "done" },
	});

	return controls;
});
