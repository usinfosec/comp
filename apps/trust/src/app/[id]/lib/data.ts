"use server";

import { db } from "@comp/db";

export const findOrganization = async (id: string) => {
	const organization = await db.organization.findFirst({
		where: { id: id },
	});

	const isPublished = await db.trust.findUnique({
		where: { organizationId: organization?.id, status: "published" },
	});

	if (!organization || !isPublished) {
		return null;
	}

	return {
		...organization,
	};
};

export const getPublishedPolicies = async (organizationId: string) => {
	const policies = await db.policy.findMany({
		where: { organizationId, status: "published" },
	});

	return policies;
};

export const getPublishedPolicy = async (
	organizationId: string,
	policyId: string,
) => {
	const policy = await db.policy.findFirst({
		where: { organizationId, status: "published", id: policyId },
	});

	return policy;
};

export const getPublishedControls = async (organizationId: string) => {
	const controls = await db.task.findMany({
		where: { organizationId, status: "done" },
	});

	return controls;
};
