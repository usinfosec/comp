import { db } from "@comp/db";
import { EvidenceDetails } from "./components/EvidenceDetails";
import { headers } from "next/headers";
import { auth } from "@comp/auth";

interface EvidencePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EvidencePage({ params }: EvidencePageProps) {
	const { id } = await params;

	const assignees = await getAssignees();
	const evidence = await getEvidence(id);

	return <EvidenceDetails assignees={assignees} evidence={evidence} />;
}

const getAssignees = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return [];
	}

	const assignees = await db.member.findMany({
		where: {
			organizationId: orgId,
			role: {
				notIn: ["employee"],
			},
		},
		include: {
			user: true,
		},
	});

	return assignees;
};

const getEvidence = async (id: string) => {
	const evidence = await db.evidence.findUnique({
		where: {
			id,
		},
		include: {
			assignee: true,
		},
	});

	if (!evidence) {
		throw new Error("Evidence not found");
	}

	return evidence;
};
