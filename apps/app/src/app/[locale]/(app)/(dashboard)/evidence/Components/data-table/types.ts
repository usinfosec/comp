import type { OrganizationEvidence } from "@bubba/db";

export type EvidenceTaskRow = OrganizationEvidence & {
  evidence: {
    name: string;
  };
};
