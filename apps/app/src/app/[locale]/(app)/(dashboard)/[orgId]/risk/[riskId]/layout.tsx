import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { redirect } from "next/navigation";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ riskId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const t = await getI18n();
	const session = await auth();

	if (!session || !session.user.organizationId) {
		redirect("/");
	}

	const riskId = await params;
	const risk = await getRisk(riskId.riskId, session.user.organizationId);

	if (!risk) {
		redirect(`/${session.user.organizationId}/risk`);
	}

	const orgId = session.user.organizationId;

	return (
		<div className="max-w-[1200px] space-y-4 m-auto">
			<SecondaryMenu
				showBackButton
				backButtonHref={`/${orgId}/risk/register`}
				items={[
					{
						path: `/${orgId}/risk/${riskId.riskId}`,
						label: t("risk.overview"),
					},
					{
						path: `/${orgId}/risk/${riskId.riskId}/comments`,
						label: t("common.comments.title"),
					},
				]}
			/>

			<main className="mt-8">{children}</main>
		</div>
	);
}

const getRisk = async (riskId: string, organizationId: string) => {
	const risk = await db.risk.findUnique({
		where: {
			id: riskId,
			organizationId: organizationId,
		},
	});

	return risk;
};
