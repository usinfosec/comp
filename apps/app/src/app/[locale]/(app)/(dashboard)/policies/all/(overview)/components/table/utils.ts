import type { PolicyStatus } from "./types";

export function getStatusStyle(status: PolicyStatus) {
  switch (status) {
    case "published":
      return "bg-[#00DC73]";
    case "draft":
      return "bg-[#ffc107]";
    case "needs_review":
      return "bg-[#ff0000]";
    case "archived":
      return "bg-[#0ea5e9]";
  }
}

export function formatStatus(status: PolicyStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
}
