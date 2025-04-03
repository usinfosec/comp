import { EvidenceList } from "./components/EvidenceList";
import { EvidenceTableProvider } from "./hooks/useEvidenceTableContext";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";
export default function EvidencePage() {
	return (
		<EvidenceTableProvider>
			<PageWithBreadcrumb breadcrumbs={[{ label: "Evidence", current: true }]}>
				<EvidenceList />
			</PageWithBreadcrumb>
		</EvidenceTableProvider>
	);
}
