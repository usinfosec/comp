import { auth } from "@bubba/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSingleFrameworkInstanceWithControls } from "../../../data/getSingleFrameworkInstanceWithControls";
import { getFrameworkRequirements } from "../../../lib/getFrameworkRequirements";
import { RequirementControls } from "./components/RequirementControls";

interface PageProps {
	params: Promise<{
		frameworkInstanceId: string;
		requirementKey: string;
	}>;
}

export default async function RequirementPage({ params }: PageProps) {
	const { frameworkInstanceId, requirementKey } = await params;

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

	const requirements = getFrameworkRequirements(
		frameworkInstanceWithControls.frameworkId,
	);
	const requirement = requirements[requirementKey as keyof typeof requirements];

	if (!requirement) {
		redirect(`/${organizationId}/frameworks/${frameworkInstanceId}`);
	}

	return (
		<div className="flex flex-col gap-6">
			<RequirementControls
				requirement={requirement}
				requirementKey={requirementKey}
				frameworkInstanceWithControls={frameworkInstanceWithControls}
			/>
		</div>
	);
}
