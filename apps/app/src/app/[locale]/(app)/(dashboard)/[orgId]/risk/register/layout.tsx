import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();
	const session = await auth();
	const user = session?.user;
	const orgId = user?.organizationId;

	return (
		<div className="max-w-[1200px] m-auto">
			<SecondaryMenu
				items={[
					{ path: `/${orgId}/risk`, label: t("risk.dashboard.title") },
					{ path: `/${orgId}/risk/register`, label: t("risk.register.title") },
				]}
			/>

			<main className="mt-8">{children}</main>
		</div>
	);
}
