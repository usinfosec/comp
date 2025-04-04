"use server";

import { db } from "@comp/db";
import { authActionClient } from "@/actions/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@comp/auth";
import { appErrors } from "../types";
import type { Departments } from "@comp/db/types";
import { headers } from "next/headers";

const schema = z.object({
  employeeId: z.string(),
  name: z.string().min(1, "Name cannot be empty").optional(),
  email: z.string().email("Invalid email format").optional(),
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
      const { employeeId, name, email, department, isActive } = parsedInput;

      const session = await auth.api.getSession({
        headers: await headers(),
      });

      const organizationId = session?.session.activeOrganizationId;

      if (!organizationId) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      try {
        const member = await db.member.findUnique({
          where: {
            id: employeeId,
            organizationId,
          },
        });

        if (!member) {
          return {
            success: false,
            error: appErrors.NOT_FOUND,
          };
        }

        const memberUpdateData: {
          department?: Departments;
          isActive?: boolean;
        } = {};
        const userUpdateData: { name?: string; email?: string } = {};

        if (department !== undefined && department !== member.department) {
          memberUpdateData.department = department as Departments;
        }
        if (isActive !== undefined && isActive !== member.isActive) {
          memberUpdateData.isActive = isActive;
        }
        if (name !== undefined) {
          userUpdateData.name = name;
        }
        if (email !== undefined) {
          userUpdateData.email = email;
        }

        const hasMemberChanges = Object.keys(memberUpdateData).length > 0;
        const hasUserChanges = Object.keys(userUpdateData).length > 0;

        if (!hasMemberChanges && !hasUserChanges) {
          return {
            success: true,
            data: member,
          };
        }

        const updatedMember = await db.$transaction(async (tx) => {
          if (hasUserChanges) {
            await tx.user.update({
              where: { id: member.userId },
              data: userUpdateData,
            });
          }

          if (hasMemberChanges) {
            return tx.member.update({
              where: {
                id: employeeId,
                organizationId,
              },
              data: memberUpdateData,
            });
          }

          return member;
        });

        revalidatePath(`/${organizationId}/employees/${employeeId}`);
        revalidatePath(`/${organizationId}/employees`);

        return {
          success: true,
          data: updatedMember,
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
