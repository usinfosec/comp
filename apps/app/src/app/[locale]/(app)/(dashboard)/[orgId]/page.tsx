import { redirect } from "next/navigation";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ orgId: string }>;
}) {
	const organizationId = (await params).orgId;

	redirect(`/${organizationId}/frameworks`);
}
