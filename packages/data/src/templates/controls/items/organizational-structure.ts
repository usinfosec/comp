import type { Control } from "../types";

export const organizationalStructure: Control = {
	id: "organizational_structure",
	name: "Organizational Structure",
	description:
		"The organization demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "human_resources",
		},
		{
			type: "evidence",
			evidenceId: "hr_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC1",
		},
	],
};
