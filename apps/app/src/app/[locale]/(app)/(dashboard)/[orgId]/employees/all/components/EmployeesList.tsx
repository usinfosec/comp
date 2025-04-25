"use server";

// Remove inviteEmployee import and add bulkInviteEmployees import
// import { inviteEmployee } from "@/actions/organization/invite-employee";
import { bulkInviteEmployees } from "@/actions/organization/bulk-invite-employees";
import { removeEmployeeRoleOrMember } from "@/actions/organization/remove-employee";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { Member, User } from "@prisma/client";
import { headers } from "next/headers";
import { EmployeesListClient } from "./EmployeesListClient";

// Define and export the type for employees with user data
export interface EmployeeWithUser extends Member {
	user: User;
}

// TODO: Implement data fetching logic similar to TeamMembers.tsx
// Fetch members with 'employee' role
// Import and pass server actions (bulkInviteEmployees, removeEmployeeRoleOrMember)
// Import and render EmployeesListClient

export async function EmployeesList() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const organizationId = session?.session.activeOrganizationId;

	let employees: EmployeeWithUser[] = [];

	if (organizationId) {
		const fetchedMembers = await db.member.findMany({
			where: {
				organizationId: organizationId,
			},
			include: {
				user: true,
			},
		});

		// Filter for members who have the employee role
		employees = fetchedMembers.filter((member) => {
			// Handle both comma-separated roles and single role
			const roles = member.role.includes(",")
				? member.role.split(",")
				: [member.role];
			return roles.includes("employee");
		});
	}

	return (
		<EmployeesListClient
			data={employees}
			organizationId={organizationId ?? ""}
		/>
	);
}
