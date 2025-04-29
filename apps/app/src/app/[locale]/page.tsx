import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect("/auth");
	}

	const orgId = session.session.activeOrganizationId;

	if (!orgId) {
		return redirect("/setup");
	}

	return redirect(`/${orgId}/implementation`);
}
