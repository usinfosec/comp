import type { Control } from "../types";

export const exceptionHandling: Control = {
	id: "exception_handling",
	name: "Exception Handling",
	description:
		"The entity identifies and resolves processing exceptions in a timely manner.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security",
		},
		{
			type: "evidence",
			evidenceId: "exceptionLogs",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "PI1",
		},
	],
};
