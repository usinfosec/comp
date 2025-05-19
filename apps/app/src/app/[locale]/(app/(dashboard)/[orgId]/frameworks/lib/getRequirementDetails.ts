import { requirements, Requirement } from "@comp/data";

export function getRequirementDetails(
	targetRequirementId: string,
): Requirement | undefined {
	for (const frameworkKey in requirements) {
		// The key is a FrameworkId, get the SingleFrameworkRequirements object
		const frameworkRequirements = requirements[frameworkKey as keyof typeof requirements];
		if (frameworkRequirements && frameworkRequirements[targetRequirementId]) {
			return frameworkRequirements[targetRequirementId];
		}
	}
	return undefined;
} 