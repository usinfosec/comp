"use server";

import { db } from "@bubba/db";
import { authActionClient } from "@/actions/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { appErrors } from "../types";
import type { Departments } from "@bubba/db/types";

const schema = z.object({
  employeeId: z.string(),
  department: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateEmployee = authActionClient
  .schema(schema)
  .metadata({
    name: "update-employee",
    track: {
      event: "update-employee",
      channel: "server",
    },
  })
  .action(
    async ({
      parsedInput,
    }): Promise<
      { success: true; data: any } | { success: false; error: any }
    > => {
      const { employeeId, department, isActive } = parsedInput;

      const session = await auth();
      const organizationId = session?.user.organizationId;

      if (!organizationId) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      try {
        const employee = await db.employee.findUnique({
          where: {
            id: employeeId,
            organizationId,
          },
        });

        if (!employee) {
          return {
            success: false,
            error: appErrors.NOT_FOUND,
          };
        }

        // Build update data based on provided values
        const updateData: { department?: Departments; isActive?: boolean } = {};

        // Only include fields that were provided
        if (department !== undefined) {
          updateData.department = department as Departments;
        }

        if (isActive !== undefined) {
          updateData.isActive = isActive;
        }

        // Only update if there are changes
        if (Object.keys(updateData).length === 0) {
          return {
            success: true,
            data: employee,
          };
        }

        const updatedEmployee = await db.employee.update({
          where: {
            id: employeeId,
            organizationId,
          },
          data: updateData,
        });

        // Revalidate related paths
        revalidatePath(`/${organizationId}/employees/${employeeId}`);
        revalidatePath(`/${organizationId}/employees`);

        return {
          success: true,
          data: updatedEmployee,
        };
      } catch (error) {
        console.error("Error updating employee:", error);
        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        };
      }
    }
  );
