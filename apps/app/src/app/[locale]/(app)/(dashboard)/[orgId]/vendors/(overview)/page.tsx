import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { Button } from "@bubba/ui/button";
import { Card } from "@bubba/ui/card";
import Link from "next/link";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { CreateVendorSheet } from "../components/create-vendor-sheet";

export default async function VendorManagement({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	const session = await auth();

	if (!session?.user?.organizationId) {
		redirect("/onboarding");
	}

	const overview = await getVendorOverview(session.user.organizationId);

	if (overview?.vendors === 0) {
		return (
			<div className="min-h-[400px] flex items-center justify-center">
				<Card className="w-full max-w-lg p-8 space-y-6">
					<div className="space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							No vendors found
						</h1>
						<p className="text-muted-foreground">
							Get started by adding your first vendor
						</p>
					</div>

					<div className="flex justify-center">
						<Button asChild>
							<Link href={`/${session.user.organizationId}/vendors/register`}>
								Add vendor
							</Link>
						</Button>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-8">
			Coming Soon
			{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RiskOverview organizationId={session.user.organizationId} />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <RisksAssignee organizationId={session.user.organizationId} />
      </div> */}
		</div>
	);
}

async function getVendorOverview(organizationId: string) {
	return await db.$transaction(async (tx) => {
		const [vendors] = await Promise.all([
			tx.vendor.count({
				where: { organizationId },
			}),
		]);

		return {
			vendors,
		};
	});
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("sidebar.risk"),
	};
}
