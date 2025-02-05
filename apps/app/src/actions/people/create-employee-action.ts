"use server";

import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { authActionClient } from "../safe-action";
import { createEmployeeSchema } from "../schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ActionResponse } from "../types";

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
    const { name, email, department } = parsedInput;
    const { user } = ctx;

    if (!user.organizationId) {
      return {
        success: false,
        error: "Not authorized - no organization found",
      };
    }

    try {
      await db.employee.create({
        data: {
          name,
          email,
          department,
          organizationId: user.organizationId,
        },
      });

      revalidatePath("/people");

      return {
        success: true,
        data: null,
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
