import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { PathProvider } from "./PathProvider";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();
	const session = await auth();
	const user = session?.user;
	const organizationId = user?.organizationId;

	return (
		<div className="max-w-[1200px] m-auto">
			<PathProvider
				organizationId={organizationId ?? ""}
				translationBackButton={t("evidence.dashboard.layout_back_button")}
				translationOverview={t("evidence.overview")}
				translationEdit={t("evidence.edit")}
			/>
			<main className="py-4">{children}</main>
		</div>
	);
}
