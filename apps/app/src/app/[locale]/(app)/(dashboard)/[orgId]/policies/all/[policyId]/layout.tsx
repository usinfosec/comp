import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { redirect } from "next/navigation";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ policyId: string; orgId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const t = await getI18n();
	const { policyId, orgId } = await params;

	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	const policy = await getPolicy(policyId, organizationId);

	if (!policy) {
		redirect("/");
	}

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

const getPolicy = async (policyId: string, organizationId: string) => {
	const policy = await db.policy.findUnique({
		where: {
			id: policyId,
			organizationId: organizationId,
		},
	});

	return policy;
};
