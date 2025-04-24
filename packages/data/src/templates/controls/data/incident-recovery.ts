import type { TemplateControl as Control } from "../types";

export const incidentRecovery: Control = {
	id: "incident_recovery",
	name: "Incident Recovery",
	description:
		"The entity has controls to restore system availability after incidents.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "business_continuity_policy",
		},
	],
	mappedTasks: [
		{
			taskId: "incident_recovery_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "A1",
		},
	],
};
