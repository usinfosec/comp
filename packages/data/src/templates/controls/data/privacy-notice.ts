import type { Control } from "../types";

export const privacyNotice: Control = {
	id: "privacy_notice",
	name: "Privacy Notice",
	description:
		"The entity provides notice about the collection, use, and disclosure of personal information.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "privacy",
		},
		{
			type: "evidence",
			evidenceId: "privacyNotice",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "P1",
		},
	],
};
