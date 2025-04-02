import { auth } from "@bubba/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSingleFrameworkInstanceWithControls } from "../../data/getSingleFrameworkInstanceWithControls";
import { FrameworkControls } from "./components/FrameworkControls";
import { FrameworkOverview } from "./components/FrameworkOverview";
import { FrameworkRequirements } from "./components/FrameworkRequirements";

interface PageProps {
	params: Promise<{
		frameworkInstanceId: string;
	}>;
}

export default async function FrameworkPage({ params }: PageProps) {
	const { frameworkInstanceId } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/");
	}

	const organizationId = session.session.activeOrganizationId;

	if (!organizationId) {
		redirect("/");
	}

	const frameworkInstanceWithControls =
		await getSingleFrameworkInstanceWithControls({
			organizationId,
			frameworkInstanceId,
		});

	if (!frameworkInstanceWithControls) {
		redirect("/");
	}

	return (
		<div className="flex flex-col gap-6">
			<FrameworkOverview
				frameworkInstanceWithControls={frameworkInstanceWithControls}
			/>
			<FrameworkControls
				frameworkInstanceWithControls={frameworkInstanceWithControls}
			/>
			<FrameworkRequirements
				frameworkId={frameworkInstanceWithControls.frameworkId}
			/>
		</div>
	);
}
