"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@comp/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	// Generate breadcrumb segments from the pathname
	const segments = pathname.split("/").filter(Boolean);
	// Example path: /en/app/dashboard/org_abc/tasks/tsk_123
	// segments: [en, app, dashboard, org_abc, tasks, tsk_123]

	// Find the index of 'tasks' to determine the base path and potential taskId
	const tasksIndex = segments.findIndex((seg) => seg === "tasks");
	let tasksPath = "";
	let taskId: string | null = null;

	if (tasksIndex !== -1) {
		tasksPath = `/${segments.slice(0, tasksIndex + 1).join("/")}`;
		if (segments.length > tasksIndex + 1) {
			taskId = segments[tasksIndex + 1];
		}
	}

	return (
		<main className="mt-4">
			{/* Render Breadcrumbs only if we are in the tasks section */}
			{tasksPath && (
				<div className="border-b pb-4">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href={tasksPath}>
									Tasks
								</BreadcrumbLink>
							</BreadcrumbItem>
							{taskId && (
								<>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										{/* Render taskId as BreadcrumbPage since it's the current page */}
										<BreadcrumbPage>
											{taskId}
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
