import { cache } from "react";
import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { EmployeeCompletionChart } from "./EmployeeCompletionChart";
import { headers } from "next/headers";

export async function EmployeesOverview() {
	const employees = await getEmployees();
	const policies = await getEmployeePolicies();

	return (
		<div className="grid gap-6">
			<EmployeeCompletionChart employees={employees} policies={policies} />
		</div>
	);
}

const getEmployees = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return [];
	}

	const employees = await db.member.findMany({
		where: {
			organizationId: orgId,
			role: "employee",
		},
		include: {
			user: true,
		},
	});

	return employees;
});

const getEmployeePolicies = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return [];
	}

	const policies = await db.policy.findMany({
		where: {
			organizationId: orgId,
			isRequiredToSign: true,
		},
	});

	return policies;
});
