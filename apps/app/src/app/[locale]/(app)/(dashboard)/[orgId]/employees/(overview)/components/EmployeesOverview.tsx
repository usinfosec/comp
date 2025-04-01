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

  const portalEmployees = await db.employee.findMany({
    where: {
      organizationId: orgId,
    },
  });

  const employees = await db.employee.findMany({
    where: {
      organizationId: orgId,
      email: {
        in: portalEmployees.map((employee) => employee.email),
      },
    },
  });

  // Create a map of employees with their active status
  const employeeStatusMap = new Map(
    employees.map((employee) => [employee.email, employee.isActive]),
  );

  // Filter portal employees to only include those that have a matching employee record
  // and where that employee is active
  // TODO: REMOVE ONCE WE GET RID OF PORTAL EMPLOYEES TABLE, THEN LOGIC CAN BE SIMPLIFIED TO ONLY USE EMPLOYEE TABLE.
  const activePortalEmployees = portalEmployees.filter(
    (portalUser) =>
      employeeStatusMap.has(portalUser.email) &&
      employeeStatusMap.get(portalUser.email) === true,
  );

  return activePortalEmployees;
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
