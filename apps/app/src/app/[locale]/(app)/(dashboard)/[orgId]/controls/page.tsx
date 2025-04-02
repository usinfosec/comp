import { getI18n } from "@/locales/server";
import { auth } from "@bubba/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ControlsOverview } from "./components/ControlsOverview";
import { getAllOrganizationControls } from "./data/getAllOrganizationControls";

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
		<ControlsOverview controls={controls} organizationId={organizationId} />
	);
}
