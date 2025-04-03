import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@comp/ui/secondary-menu";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ policyId: string; orgId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const t = await getI18n();
	const { policyId, orgId } = await params;

	return (
		<div className="max-w-[1200px] space-y-4 m-auto">
			<SecondaryMenu
				showBackButton
				backButtonHref={`/${orgId}/policies/all`}
				items={[
					{
						path: `/${orgId}/policies/all/${policyId}`,
						label: t("policies.dashboard.sub_pages.overview"),
					},
					{
						path: `/${orgId}/policies/all/${policyId}/editor`,
						label: t("policies.dashboard.sub_pages.edit_policy"),
					},
				]}
			/>

			<main className="mt-8">{children}</main>
		</div>
	);
}
