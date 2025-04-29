import { redirect } from "next/navigation";
import { Checklist } from "./components/Checklist";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { getOnboardingStatus } from "./actions";

export default async function Page({
	params,
}: {
	params: Promise<{ orgId: string }>;
}) {
	const { orgId } = await params;
	const checklistData = await getOnboardingStatus(orgId);

	if ("error" in checklistData) {
		return <div>Error loading onboarding status: {checklistData.error}</div>;
	}

	return (
		<div className="space-y-6">
			<OnboardingProgress
				completedSteps={checklistData.completedItems}
				totalSteps={checklistData.totalItems}
			/>
			<Checklist items={checklistData.checklistItems} />
		</div>
	);
}
