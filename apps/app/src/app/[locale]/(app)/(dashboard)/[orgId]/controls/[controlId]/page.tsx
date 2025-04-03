import { auth } from "@comp/auth";
import { redirect } from "next/navigation";
import { SingleControl } from "./components/SingleControl";
import { getControl } from "./data/getControl";
import { getOrganizationControlProgress } from "./data/getOrganizationControlProgress";
import type { ControlProgressResponse } from "./data/getOrganizationControlProgress";
import { headers } from "next/headers";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";

interface PageProps {
	params: Promise<{ controlId: string }>;
}

export default async function SingleControlPage({ params }: PageProps) {
	const { controlId } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session.activeOrganizationId) {
		redirect("/");
	}

	const control = await getControl(controlId);

	// If we get an error or no result, redirect
	if (!control || "error" in control) {
		redirect("/");
	}

	const organizationControlProgressResult =
		await getOrganizationControlProgress(controlId);

	// Extract the progress data from the result or create default data if there's an error
	const controlProgress: ControlProgressResponse = ("data" in
		(organizationControlProgressResult || {}) &&
		organizationControlProgressResult?.data?.progress) || {
		total: 0,
		completed: 0,
		progress: 0,
		byType: {},
	};

	return (
		<PageWithBreadcrumb
			breadcrumbs={[
				{
					label: "Controls",
					href: `/${session.session.activeOrganizationId}/controls`,
				},
				{ label: control.name },
			]}
		>
			<SingleControl control={control} controlProgress={controlProgress} />
		</PageWithBreadcrumb>
	);
}
