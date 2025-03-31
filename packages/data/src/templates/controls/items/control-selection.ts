import type { Control } from "../types";

export const controlSelection: Control = {
	id: "control_selection",
	name: "Control Selection",
	description:
		"The organization selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "internal_control",
		},
		{
			type: "evidence",
			evidenceId: "control_selection_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC5",
		},
	],
};
