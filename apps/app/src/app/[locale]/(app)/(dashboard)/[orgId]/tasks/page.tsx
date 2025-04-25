import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";
import { TaskList } from "./components/TaskList";
import { Role, TaskStatus, TaskEntityType } from "@comp/db/types";
import { cache } from "react";

// Force dynamic rendering to ensure searchParams are always fresh
export const dynamic = "force-dynamic";

// Use cached versions of data fetching functions
export default async function TasksPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	// Extract specific params to pass down
	const params = await searchParams;
	const statusFilter = params?.status as string | undefined;
	const entityTypesFilter = params?.entityTypes as string | undefined;

	const tasks = await getCachedTasks(statusFilter, entityTypesFilter);
	const members = await getCachedMembersWithMetadata();

	return <TaskList tasks={tasks} members={members} />;
}

// Wrap getTasks logic in React.cache
const getCachedTasks = cache(
	async (statusParam?: string, entityTypesParam?: string) => {
		console.log("Fetching tasks with cache...", {
			statusParam,
			entityTypesParam,
		});
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		const orgId = session?.session.activeOrganizationId;

		if (!orgId) {
			return [];
		}

		const whereClause: {
			organizationId: string;
			status?: TaskStatus;
			entityType?: { in: TaskEntityType[] };
		} = { organizationId: orgId };

		// Filter by Status (using passed argument)
		if (typeof statusParam === "string" && statusParam in TaskStatus) {
			whereClause.status = statusParam as TaskStatus;
			console.log(`Filtering by status: ${whereClause.status}`);
		}

		// Filter by Entity Type(s) (using passed argument)
		if (
			typeof entityTypesParam === "string" &&
			entityTypesParam.length > 0
		) {
			const types = entityTypesParam.split(",");
			const validEntityTypes = types.filter(
				(type): type is TaskEntityType => type in TaskEntityType,
			);
			if (validEntityTypes.length > 0) {
				whereClause.entityType = { in: validEntityTypes };
				console.log(
					`Filtering by entity types: ${validEntityTypes.join(", ")}`,
				);
			}
		}

		const tasks = await db.task.findMany({
			where: whereClause,
			orderBy: [
				{ status: "asc" },
				{ entityType: "asc" },
				{ order: "asc" },
				{ createdAt: "asc" },
			],
		});
		return tasks;
	},
);

// Wrap getMembersWithMetadata logic in React.cache
const getCachedMembersWithMetadata = cache(async () => {
	console.log("Fetching members with cache...");
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return [];
	}

	const members = await db.member.findMany({
		where: {
			organizationId: orgId,
			role: {
				notIn: [Role.employee, Role.auditor],
			},
		},
		include: {
			user: true,
		},
	});

	return members;
});
