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
		return (
			<div>Error loading onboarding status: {checklistData.error}</div>
		);
	}

	return (
		<div className="space-y-6 max-w-[600px] mx-auto">
			<OnboardingProgress
				completedSteps={checklistData.completedItems}
				totalSteps={checklistData.totalItems}
			/>
			<Checklist key={checklistData.checklistItems.length} items={checklistData.checklistItems} />
		</div>
	);
}
