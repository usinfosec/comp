import { auth } from "@bubba/auth";
import { getI18n } from "@/locales/server";
import { redirect } from "next/navigation";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { headers } from "next/headers";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session?.activeOrganizationId) {
		console.log("Redirect on layout.tsx");
		redirect("/auth");
	}

	return (
		<div className="max-w-[1200px] mx-auto">
			<SecondaryMenu
				items={[
					{
						path: `/${session.session.activeOrganizationId}/overview`,
						label: t("frameworks.title"),
					},
				]}
			/>

			<main className="mt-8">{children}</main>
		</div>
	);
}
