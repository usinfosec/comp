"use server";

import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { authActionClient } from "../safe-action";
import { createEmployeeSchema } from "../schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const createEmployeeAction = authActionClient
  .schema(createEmployeeSchema)
  .metadata({
    name: "create-employee",
    track: {
      event: "create-employee",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { name, email, department } = parsedInput;
    const { user } = ctx;

    if (!user.organizationId) {
      return {
        data: null,
        serverError: "Not authorized - no organization found",
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
        data: null,
      };
    } catch (error) {
      console.error("Error creating employee:", error);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          data: null,
          serverError:
            "An employee with this email already exists in your organization",
        };
      }

      return {
        data: null,
        serverError: "Failed to create employee",
      };
    }
  });
