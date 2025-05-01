import { AppOnboarding } from "@/components/app-onboarding";
import { getI18n } from "@/locales/server";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { SecondaryMenu } from "@comp/ui/secondary-menu";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();

	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return redirect("/");
	}

	// Fetch all members first
	const allMembers = await db.member.findMany({
		where: {
			organizationId: orgId,
		},
		include: {
			user: true,
		},
	});

	return (
		<div className="max-w-[1200px] m-auto">
			<SecondaryMenu
				items={[
					{
						path: `/${orgId}/people`,
						label: t("people.dashboard.title"),
					},
					{
						path: `/${orgId}/people/all`,
						label: t("people.title"),
					},
				]}
			/>

			<main className="mt-4">{children}</main>
		</div>
	);
}
