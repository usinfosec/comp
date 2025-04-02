import {
	Artifact,
	Control,
	Evidence,
	FrameworkInstance,
	Policy,
	RequirementMap,
} from "@bubba/db/types";

export type FrameworkInstanceWithControls = FrameworkInstance & {
	controls: (Control & {
		artifacts: (Artifact & {
			policy: Policy | null;
			evidence: Evidence | null;
		})[];
	})[];
};
