import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { RiskRegisterTable } from "./RiskRegisterTable";

export default async function RiskRegisterPage() {
	const session = await auth();

	if (!session?.user?.organizationId) {
		redirect("/onboarding");
	}

	const vendors = await db.vendor.findMany({
		where: {
			organizationId: session.user.organizationId
		},
		include: {
			owner: true
		}
	});

	return <RiskRegisterTable vendors={vendors} />;
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
		title: t("sub_pages.vendors.register"),
	};
}
