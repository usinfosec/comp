import {
	Artifact,
	Control,
	FrameworkInstance,
	Policy,
	RequirementMap,
} from "@comp/db/types";

export type FrameworkInstanceWithControls = FrameworkInstance & {
	controls: (Control & {
		artifacts: (Artifact & {
			policy: Policy | null;
		})[];
		requirementsMapped: RequirementMap[];
	})[];
};
