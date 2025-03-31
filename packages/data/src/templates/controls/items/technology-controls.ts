import type { Control } from "../types";

export const technologyControls: Control = {
	id: "technology_controls",
	name: "Technology Controls",
	description:
		"The organization selects and develops general control activities over technology to support the achievement of objectives.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security",
		},
		{
			type: "evidence",
			evidenceId: "technology_control_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC5",
		},
	],
};
