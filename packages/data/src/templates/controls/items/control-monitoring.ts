import type { Control } from "../types";

export const controlMonitoring: Control = {
	id: "control_monitoring",
	name: "Control Monitoring",
	description:
		"The organization selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "internal_control",
		},
		{
			type: "evidence",
			evidenceId: "control_monitoring_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC4",
		},
	],
};
