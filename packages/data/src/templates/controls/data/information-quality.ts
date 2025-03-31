import type { Control } from "../types";

export const informationQuality: Control = {
	id: "information_quality",
	name: "Information Quality",
	description:
		"The organization obtains or generates and uses relevant, quality information to support the functioning of internal control.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security",
		},
		{
			type: "evidence",
			evidenceId: "dataQualityDocumentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC2",
		},
	],
};
