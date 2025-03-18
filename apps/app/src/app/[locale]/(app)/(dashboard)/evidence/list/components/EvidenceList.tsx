"use client";

import { useEvidenceTable } from "../hooks/useEvidenceTableContext";
import { EvidenceListTable } from "./table/EvidenceListTable";

export function EvidenceList() {
	const { evidenceTasks } = useEvidenceTable();

	return <EvidenceListTable data={evidenceTasks || []} />;
}
