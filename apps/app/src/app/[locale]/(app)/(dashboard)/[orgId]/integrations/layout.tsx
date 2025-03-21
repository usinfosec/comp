import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function IntegrationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const user = session?.user;

	if (!user?.isAdmin) {
		redirect(`/${user?.organizationId}`);
	}

	return children;
}
