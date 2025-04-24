"use server";

import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";

export async function getOnboardingForCurrentOrganization() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Not authenticated");
	}

	const organizationId = session.session.activeOrganizationId;

	if (!organizationId) {
		throw new Error("No organization ID");
	}

	const onboarding = await db.onboarding.findUnique({
		where: {
			organizationId,
		},
	});

	const completedPolicies = Boolean(onboarding?.policies);
	const completedEmployees = Boolean(onboarding?.employees);
	const completedVendors = Boolean(onboarding?.vendors);
	const completedRisk = Boolean(onboarding?.risk);
	const completedTasks = Boolean(onboarding?.tasks);

	const completedAll =
		completedPolicies &&
		completedEmployees &&
		completedVendors &&
		completedRisk &&
		completedTasks;

	return {
		onboarding,
		completedAll,
	};
}
