import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@comp/ui/secondary-menu";
import { Separator } from "@comp/ui/separator";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ policyId: string; orgId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const t = await getI18n();
	const { orgId } = await params;

	return (
		<div className="max-w-[1200px] m-auto flex flex-col gap-4">
			<SecondaryMenu
				items={[
					{
						path: `/${orgId}/policies`,
						label: t("policies.dashboard.title"),
					},
					{
						path: `/${orgId}/policies/all`,
						label: t("policies.dashboard.all"),
					},
				]}
			/>
			<Separator />
			<div>{children}</div>
		</div>
	);
}
