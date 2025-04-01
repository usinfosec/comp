import { auth } from "@bubba/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ vendorId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const t = await getI18n();

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		redirect("/");
	}

	const { vendorId } = await params;

	if (!vendorId) {
		redirect(`/${session.session.activeOrganizationId}/vendors`);
	}

	const orgId = session.session.activeOrganizationId;

	const vendor = await db.vendor.findUnique({
		where: {
			id: vendorId,
			organizationId: orgId,
		},
	});

	if (!vendor) {
		redirect(`/${orgId}/vendors/register`);
	}

	return (
		<div className="max-w-[1200px] space-y-4 m-auto">
			<SecondaryMenu
				showBackButton
				backButtonHref={`/${orgId}/vendors/register`}
				items={[
					{
						path: `/${orgId}/vendors/${vendorId}`,
						label: vendor.name,
					},
					{
						path: `/${orgId}/vendors/${vendorId}/comments`,
						label: t("common.comments.title"),
					},
				]}
			/>
			<main className="mt-8">{children}</main>
		</div>
	);
}
