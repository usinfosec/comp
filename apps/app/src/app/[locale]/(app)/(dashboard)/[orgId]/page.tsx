import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	redirect(`/${organizationId}/overview`);
}
