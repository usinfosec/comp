import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EvidenceOverview } from "./components/EvidenceOverview";
import { getEvidenceDashboard } from "./data/getEvidenceDashboard";
import { EvidenceErrorState } from "./components/EvidenceUIStates";

export default async function EvidenceOverviewPage() {
	const session = await auth();

	if (!session) {
		return redirect("/");
	}

	if (!session.user.organizationId) {
		return redirect("/");
	}

	try {
		const evidence = await getEvidenceDashboard(session.user.organizationId);

		return <EvidenceOverview evidence={evidence} />;
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "An unexpected error occurred";
		return <EvidenceErrorState message={errorMessage} />;
	}
}
