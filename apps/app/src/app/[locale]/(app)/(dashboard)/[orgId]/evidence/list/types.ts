import type { OrganizationEvidence } from "@bubba/db/types";

export type EvidenceTaskRow = OrganizationEvidence & {
  evidence: {
    name: string;
  };
  assignee?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
};
