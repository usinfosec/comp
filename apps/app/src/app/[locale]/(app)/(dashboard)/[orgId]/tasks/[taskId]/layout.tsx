import { db } from "@comp/db";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@comp/ui/breadcrumb";

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ taskId: string; orgId: string }>;
}) {
	const { taskId, orgId } = await params;

	const task = await db.task.findUnique({
		where: {
			id: taskId,
		},
	});

	return (
		<main className="mt-4">
			{/* Render Breadcrumbs only if we are in the tasks section */}
			{task?.id && (
				<div className="border-b pb-4">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href={`/${orgId}/tasks`}>
									Tasks
								</BreadcrumbLink>
							</BreadcrumbItem>
							{taskId && (
								<>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										{/* Render taskId as BreadcrumbPage since it's the current page */}
										<BreadcrumbPage>
											{task?.title}
										</BreadcrumbPage>
									</BreadcrumbItem>
								</>
							)}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			)}
			{children}
		</main>
	);
}
