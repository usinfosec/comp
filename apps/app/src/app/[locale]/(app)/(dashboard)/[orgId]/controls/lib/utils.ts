import { StatusType } from "@/components/status-indicator";
import type { ControlWithRelations } from "../data/queries";

export function getControlStatus(control: ControlWithRelations): StatusType {
	if (!control.artifacts.length) {
		return "not_started";
	}

	const hasUnpublishedArtifacts = control.artifacts.some(
		(artifact) => artifact.policy && artifact.policy.status !== "published",
	);

	const allArtifactsAreDraft = control.artifacts.every(
		(artifact) => artifact.policy && artifact.policy.status === "draft",
	);

	if (allArtifactsAreDraft) {
		return "not_started";
	}

	if (hasUnpublishedArtifacts) {
		return "in_progress";
	}

	return "completed";
}
