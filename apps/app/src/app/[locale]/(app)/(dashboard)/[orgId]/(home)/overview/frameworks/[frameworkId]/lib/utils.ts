import type { OrganizationControlType } from "../components/table/FrameworkControlsTableColumns";
import type { StatusType } from "@/components/frameworks/framework-status";

export function getControlStatus(
  requirements: OrganizationControlType["requirements"]
): StatusType {
  if (!requirements || requirements.length === 0) return "not_started";

  const totalRequirements = requirements.length;
  const completedRequirements = requirements.filter((req) => {
    switch (req.type) {
      case "policy":
        return req.organizationPolicy?.status === "published";
      case "file":
        return !!req.fileUrl;
      case "evidence":
        return req.organizationEvidence?.published === true;
      default:
        return req.published;
    }
  }).length;

  if (completedRequirements === 0) return "not_started";
  if (completedRequirements === totalRequirements) return "completed";
  return "in_progress";
}
