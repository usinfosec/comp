type OrgStatsResponse = {
	success: boolean;
	data?: {
		controls: number;
		policies: number;
		evidence: number;
		requirementMaps: number;
	};
	error?: string;
};

type FixOrgResponse = {
	success: boolean;
	data?: {
		message: string;
		details: {
			controlsCreated: number;
			policiesCreated: number;
			evidenceCreated: number;
			requirementMapsCreated: number;
		};
	};
	error?: string;
};

export type { OrgStatsResponse, FixOrgResponse };
