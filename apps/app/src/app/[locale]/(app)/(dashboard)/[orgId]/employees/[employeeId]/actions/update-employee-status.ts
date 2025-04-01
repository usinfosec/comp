"use server";

import { db } from "@bubba/db";
import { authActionClient } from "@/actions/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@bubba/auth";
import { headers } from "next/headers";
import { appErrors } from "../types";
import type { EmployeeStatusType } from "@/components/tables/people/employee-status";

const schema = z.object({
	employeeId: z.string(),
	isActive: z.boolean(),
});

export const updateEmployeeStatus = authActionClient
	.schema(schema)
	.metadata({
		name: "update-employee-status",
		track: {
			event: "update-employee-status",
			channel: "server",
		},
	})
	.action(
		async ({
			parsedInput,
		}): Promise<
			{ success: true; data: any } | { success: false; error: any }
		> => {
			const { employeeId, isActive } = parsedInput;

			const session = await auth.api.getSession({
				headers: await headers(),
			});

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

				const updatedEmployee = await db.employee.update({
					where: {
						id: employeeId,
						organizationId,
					},
					data: {
						isActive,
					},
				});

				// Revalidate related paths
				revalidatePath(`/${organizationId}/employees/${employeeId}`);
				revalidatePath(`/${organizationId}/employees`);

				return {
					success: true,
					data: updatedEmployee,
				};
			} catch (error) {
				console.error("Error updating employee status:", error);
				return {
					success: false,
					error: appErrors.UNEXPECTED_ERROR,
				};
			}
		},
	);
