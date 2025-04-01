import { db } from "@bubba/db";
import type { Employee, Departments } from "@bubba/db/types";

const DEFAULT_TASKS = [
	{
		code: "POLICY-ACCEPT",
		name: "Policy Acceptance",
		description: "Review and accept company policies",
	},
	{
		code: "DEVICE-SECURITY",
		name: "Device Security",
		description: "Complete device security checklist and configuration",
	},
] as const;

/**
 * Find an existing employee by email and organization ID
 */
export async function findEmployeeByEmail(
	email: string,
	organizationId: string,
): Promise<Employee | null> {
	return db.employee.findUnique({
		where: {
			email_organizationId: {
				email,
				organizationId,
			},
		},
	});
}

/**
 * Create a new employee or reactivate an existing one
 */
export async function createOrReactivateEmployee(params: {
	name: string;
	email: string;
	department: Departments;
	organizationId: string;
	externalEmployeeId?: string;
}): Promise<Employee> {
	const { name, email, department, organizationId, externalEmployeeId } =
		params;

	// First check if an employee exists
	const existingEmployee = await findEmployeeByEmail(email, organizationId);

	if (existingEmployee) {
		if (existingEmployee.isActive) {
			throw new Error(
				"An employee with this email already exists in your organization",
			);
		}

		// Reactivate the existing employee
		return db.employee.update({
			where: { id: existingEmployee.id },
			data: {
				name,
				department,
				externalEmployeeId,
				organizationId,
				updatedAt: new Date(),
			},
		});
	}

	// Create a new employee
	return db.employee.create({
		data: {
			name,
			email,
			department,
			organizationId,
			externalEmployeeId,
		},
	});
}

/**
 * Complete employee creation by handling all steps:
 * 1. Create/reactivate the employee
 * 2. Create/update portal user
 * 3. Create default tasks
 */
export async function completeEmployeeCreation(params: {
	name: string;
	email: string;
	department: Departments;
	organizationId: string;
	externalEmployeeId?: string;
}): Promise<Employee> {
	const employee = await createOrReactivateEmployee(params);

	// await createOrUpdatePortalUser({
	//   employeeId: employee.id,
	//   name: params.name,
	//   email: params.email,
	//   organizationId: params.organizationId,
	// });

	// await createDefaultTasksForEmployee(employee.id);

	return employee;
}
