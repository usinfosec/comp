import { db } from "@bubba/db";
import { SingleControl } from "./components/SingleControl";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function SingleControlPage({ params }: PageProps) {
	const { id } = await params;

	const session = await auth();

	if (!session?.user.organizationId) {
		redirect("/");
	}

	const organizationControl = await getControl(id, session.user.organizationId);

	if (!organizationControl) {
		redirect("/");
	}

	return <SingleControl organizationControl={organizationControl} />;
}

const getControl = async (id: string, organizationId: string) => {
	const organizationControl = await db.organizationControl.findUnique({
		where: {
			organizationId,
			id,
		},
		include: {
			control: true,
			OrganizationControlRequirement: {
				include: {
					organizationPolicy: true,
					organizationEvidence: true,
				},
			},
		},
	});

	return organizationControl;
};
