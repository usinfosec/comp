"use server";

import { db } from "@comp/db";
import { redirect } from "next/navigation";
import { cache } from "react";

export const findOrganization = cache(async (id: string) => {
	const organization = await db.organization.findFirst({
		where: { id: id },
		include: {
			trust: {
				where: {
					status: "published",
				},
			},
		},
	});

	if (!organization) {
		return redirect("/");
	}

	return {
		...organization,
	};
});

export const getPublishedPolicies = cache(async (organizationId: string) => {
	const organization = await findOrganization(organizationId);

	if (!organization) {
		return redirect("/");
	}

	const policies = await db.policy.findMany({
		where: { organizationId, status: "published" },
		select: {
			id: true,
			name: true,
			status: true,
		},
	});

	return policies;
});

export const getPublishedPolicy = cache(
	async (organizationId: string, policyId: string) => {
		const organization = await findOrganization(organizationId);

		if (!organization) {
			return redirect("/");
		}

		const policy = await db.policy.findFirst({
			where: { organizationId, status: "published", id: policyId },
			select: {
				id: true,
				name: true,
				status: true,
			},
		});

		return policy;
	},
);

export const getPublishedControls = cache(async (organizationId: string) => {
	const organization = await findOrganization(organizationId);

	if (!organization) {
		return redirect("/");
	}

	const controls = await db.task.findMany({
		where: { organizationId, status: "done" },
		select: {
			id: true,
			title: true,
			status: true,
		},
	});

	return controls;
});
