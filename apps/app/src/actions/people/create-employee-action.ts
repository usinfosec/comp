"use server";

import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { authActionClient } from "../safe-action";
import { createEmployeeSchema } from "../schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { ActionResponse } from "../types";

const DEFAULT_TASKS = [
  {
    code: "POLICY-ACCEPT",
    name: "Policy Acceptance",
    description: "Review and accept company policies",
  },
  {
    code: "INSTALL-AGENT",
    name: "Install Monitoring Agent",
    description:
      "Install and configure the security monitoring agent on your device",
  },
  {
    code: "DEVICE-SECURITY",
    name: "Device Security",
    description: "Complete device security checklist and configuration",
  },
] as const;

export const createEmployeeAction = authActionClient
  .schema(createEmployeeSchema)
  .metadata({
    name: "create-employee",
    track: {
      event: "create-employee",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }): Promise<ActionResponse> => {
    const { name, email, department, externalEmployeeId, isActive } =
      parsedInput;
    const { user } = ctx;

    if (!user.organizationId) {
      return {
        success: false,
        error: "Not authorized - no organization found",
      };
    }

    try {
      // Create the employee
      const employee = await db.employee.create({
        data: {
          name,
          email,
          department,
          organizationId: user.organizationId,
          isActive,
          externalEmployeeId,
        },
      });

      // Create or get the required tasks
      const requiredTasks = await Promise.all(
        DEFAULT_TASKS.map(async (task) => {
          return db.employeeTask.upsert({
            where: {
              employeeId_requiredTaskId: {
                employeeId: employee.id,
                requiredTaskId: task.code,
              },
            },
            create: {
              employeeId: employee.id,
              requiredTaskId: task.code,
              status: "assigned",
            },
            update: {},
          });
        })
      );

      // Assign tasks to the employee
      await Promise.all(
        requiredTasks.map((requiredTask) =>
          db.employeeTask.create({
            data: {
              employeeId: employee.id,
              requiredTaskId: requiredTask.id,
              status: "assigned",
            },
          })
        )
      );

      revalidatePath("/people");

      return {
        success: true,
        data: employee,
      };
    } catch (error) {
      console.error("Error creating employee:", error);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          success: false,
          error:
            "An employee with this email already exists in your organization",
        };
      }

      return {
        success: false,
        error: "Failed to create employee",
      };
    }
  });
