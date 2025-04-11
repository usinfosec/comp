import { StatusType } from "@/components/status-indicator";
// Import base types explicitly
import type {
  Artifact,
  Policy,
  Evidence,
  PolicyStatus,
  EvidenceStatus,
} from "@comp/db/types";

// Define the expected artifact structure explicitly, allowing null status
type ArtifactWithRelations = Artifact & {
  policy: (Policy & { status: PolicyStatus | null }) | null;
  evidence: (Evidence & { status: EvidenceStatus | null }) | null;
};

// Function to determine control status based on artifacts
export function getControlStatus(
  artifacts: ArtifactWithRelations[] // Use the explicit type
): StatusType {
  if (!artifacts || artifacts.length === 0) return "not_started";

  const totalArtifacts = artifacts.length;
  const completedArtifacts = artifacts.filter((artifact) => {
    switch (artifact.type) {
      case "policy":
        return artifact.policy?.status === "published";
      case "evidence":
        return artifact.evidence?.status === "published";
      default:
        return false;
    }
  }).length;

  if (completedArtifacts === 0) return "not_started";
  if (completedArtifacts === totalArtifacts) return "completed";
  return "in_progress";
}
