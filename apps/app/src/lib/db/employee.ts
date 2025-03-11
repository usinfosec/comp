import { type Employee, db } from "@bubba/db";
import type { Departments } from "@prisma/client";

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
  organizationId: string
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
        "An employee with this email already exists in your organization"
      );
    }

    // Reactivate the existing employee
    return db.employee.update({
      where: { id: existingEmployee.id },
      data: {
        name,
        department,
        isActive: true,
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
      isActive: true,
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

  await db.portalUser.upsert({
    where: { email },
    create: {
      id: employeeId,
      name,
      email,
      organizationId,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      employees: {
        connect: {
          id: employeeId,
        },
      },
    },
    update: {
      updatedAt: new Date(),
      name,
      email,
      organizationId,
      employees: {
        connect: {
          id: employeeId,
        },
      },
    },
  });
}

/**
 * Create default tasks for an employee
 */
export async function createDefaultTasksForEmployee(
  employeeId: string
): Promise<void> {
  // Create or get the required task definitions first and store their IDs
  const requiredTasks = await Promise.all(
    DEFAULT_TASKS.map(async (task) => {
      return db.employeeRequiredTask.upsert({
        where: { code: task.code },
        create: {
          code: task.code,
          name: task.name,
          description: task.description,
        },
        update: {},
      });
    })
  );

  // Now create the employee tasks using the actual task IDs
  await Promise.all(
    requiredTasks.map(async (task) => {
      return db.employeeTask.create({
        data: {
          employeeId: employeeId,
          requiredTaskId: task.id,
          status: "assigned",
        },
      });
    })
  );
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

  await createOrUpdatePortalUser({
    employeeId: employee.id,
    name: params.name,
    email: params.email,
    organizationId: params.organizationId,
  });

  await createDefaultTasksForEmployee(employee.id);

  return employee;
}
