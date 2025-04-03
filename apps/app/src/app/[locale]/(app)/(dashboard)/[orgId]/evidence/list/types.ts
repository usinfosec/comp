import type { Evidence } from "@bubba/db/types";

export type EvidenceTaskRow = Evidence & {
	assignee?: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
	} | null;
};
