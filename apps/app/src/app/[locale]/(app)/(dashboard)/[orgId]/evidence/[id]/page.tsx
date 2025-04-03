import { db } from "@bubba/db";
import { EvidenceDetails } from "./components/EvidenceDetails";
import { headers } from "next/headers";
import { auth } from "@bubba/auth";

interface EvidencePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EvidencePage({ params }: EvidencePageProps) {
	const { id } = await params;

	const assignees = await getAssignees();

	return <EvidenceDetails assignees={assignees} id={id} />;
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
