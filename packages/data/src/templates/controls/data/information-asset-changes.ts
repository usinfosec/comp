import type { Control } from "../types";

export const informationAssetChanges: Control = {
	id: "information_asset_changes",
	name: "Information Asset Changes",
	description:
		"The organization manages changes to system components to minimize the risk of unauthorized changes.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "change_management",
		},
		{
			type: "evidence",
			evidenceId: "changeManagementRecords",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC6",
		},
	],
};
