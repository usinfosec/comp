import {
	Artifact,
	Control,
	Task,
	FrameworkInstance,
	Policy,
	RequirementMap,
} from "@comp/db/types";

export type FrameworkInstanceWithControls = FrameworkInstance & {
	controls: (Control & {
		artifacts: (Artifact & {
			policy: Policy | null;
			task: Task | null;
		})[];
		requirementsMapped: RequirementMap[];
	})[];
};
