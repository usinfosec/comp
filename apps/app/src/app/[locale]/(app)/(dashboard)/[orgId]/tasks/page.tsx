import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { Role, TaskEntityType, TaskStatus } from "@comp/db/types";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@comp/ui/breadcrumb";
import { headers } from "next/headers";
import { cache } from "react";
import { TaskList } from "./components/TaskList";

// Force dynamic rendering to ensure searchParams are always fresh
export const dynamic = "force-dynamic";

// Use cached versions of data fetching functions
export default async function TasksPage({
	searchParams,
	params,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
	params: Promise<{ orgId: string }>;
}) {
	// Extract specific params to pass down
	const { orgId } = await params;
	const allSearchParams = await searchParams;
	const statusFilter = allSearchParams?.status as string | undefined;
	const entityTypesFilter = allSearchParams?.entityTypes as string | undefined;
	
	const tasks = await getCachedTasks(statusFilter, entityTypesFilter);
	const members = await getCachedMembersWithMetadata();


	return (
		<main className="mt-4">
			{/* Render Breadcrumbs only if we are in the tasks section */}
			<div className="border-b pb-4">
				<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href={`/${orgId}/tasks`}>
							Tasks
						</BreadcrumbLink>
					</BreadcrumbItem>
					
				</BreadcrumbList>
			</Breadcrumb>
		</div>
			<TaskList tasks={tasks} members={members} />
		</main>
	);
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
