import { getI18n } from "@/locales/server";
import { auth } from "@comp/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ControlsOverview } from "./components/ControlsOverview";
import { getAllOrganizationControls } from "./data/getAllOrganizationControls";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";

export async function generateMetadata() {
	const t = await getI18n();

	return {
		title: t("controls.overview.title"),
	};
}

export default async function ControlsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId) {
		redirect("/");
	}

	const controls = await getAllOrganizationControls({
		organizationId,
	});

	return (
		<PageWithBreadcrumb breadcrumbs={[{ label: "Controls" }]}>
			<ControlsOverview controls={controls} organizationId={organizationId} />
		</PageWithBreadcrumb>
	);
}
