import { auth } from "@/auth";
import { getOrganizations } from "@/data/getOrganizations";
import { db } from "@bubba/db";
import { Skeleton } from "@bubba/ui/skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OrganizationSwitcher } from "./organization-switcher";

export async function OrgMenu() {
	const session = await auth();
	const { organizations } = await getOrganizations();
	const frameworks = await getFrameworks();

	const user = session?.user;
	const currentOrganizationId = user?.organizationId;

	if (!currentOrganizationId) {
		redirect("/");
	}

	return (
		<Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
			<OrganizationSwitcher
				organizations={organizations}
				organizationId={currentOrganizationId}
				frameworks={frameworks}
			/>
		</Suspense>
	);
}

const getFrameworks = async () => {
	return await db.framework.findMany({
		orderBy: {
			name: "asc",
		},
	});
};
