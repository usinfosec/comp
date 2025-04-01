import { db } from "@bubba/db";
import type { Employee, Departments } from "@bubba/db/types";
import { InvitePortalEmail } from "@bubba/email/emails/invite-portal";
import { sendEmail } from "@bubba/email/lib/resend";

if (!process.env.NEXT_PUBLIC_PORTAL_URL) {
  throw new Error("NEXT_PUBLIC_PORTAL_URL is not set");
}

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
 * Create or update a portal user for an employee
 */
export async function createOrUpdatePortalUser(params: {
  employeeId: string;
  name: string;
  email: string;
  organizationId: string;
}): Promise<void> {
  const { employeeId, name, email, organizationId } = params;

  await db.employee.upsert({
    where: { email_organizationId: { email, organizationId } },
    create: {
      id: employeeId,
      name,
      email,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {
      updatedAt: new Date(),
      name,
      email,
      organizationId,
    },
  });
}

const inviteEmployeeToPortal = async (params: {
  email: string;
  organizationName: string;
  inviteLink: string;
}) => {
  const { email, organizationName, inviteLink } = params;

  await sendEmail({
    to: email,
    subject: `You've been invited to join ${organizationName || "an organization"} on Comp AI`,
    react: InvitePortalEmail({
      email,
      organizationName,
      inviteLink,
    }),
  });

  return {
    success: true,
    message: "Employee invited to portal",
  };
};

/**
 * Complete employee creation by handling all steps:
 * 1. Create/reactivate the employee
 * 2. Create/update portal user
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

  const organization = await db.organization.findUnique({
    where: {
      id: params.organizationId,
    },
  });

  await inviteEmployeeToPortal({
    email: params.email,
    organizationName: organization?.name || "an organization",
    inviteLink: `${process.env.NEXT_PUBLIC_PORTAL_URL}`,
  });

	return employee;
}
