import { requirements } from "@comp/data";

export function getRequirementDetails(
	requirementId: string,
) {
	return requirements[requirementId];
}
