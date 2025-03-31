export interface Artifact {
	id: string;
	type: "policy" | "evidence" | "training";
	policyId?: string;
	evidenceId?: string;
	name?: string;
	description?: string;
}

export interface Control {
	code: string;
	name: string;
	description: string;
	domain: string;
	requirementId: string;
	artifacts: Artifact[];
}

export interface Controls {
	[key: string]: Control;
}
