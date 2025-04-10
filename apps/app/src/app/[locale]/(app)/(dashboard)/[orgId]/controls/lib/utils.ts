import type { ControlWithRelations } from "../data/queries";
import { StatusType } from "@/components/status-indicator";

export function getControlStatus(control: ControlWithRelations): StatusType {
  console.log({
    control,
  });
  if (!control.artifacts.length) {
    return "not_started";
  }

  const hasUnpublishedArtifacts = control.artifacts.some(
    (artifact) =>
      (artifact.policy && artifact.policy.status !== "published") ||
      (artifact.evidence && artifact.evidence.status !== "published")
  );

  const allArtifactsAreDraft = control.artifacts.every(
    (artifact) =>
      (artifact.policy && artifact.policy.status === "draft") ||
      (artifact.evidence && artifact.evidence.status === "draft")
  );

  if (allArtifactsAreDraft) {
    return "not_started";
  }

  if (hasUnpublishedArtifacts) {
    return "in_progress";
  }

  return "completed";
}
