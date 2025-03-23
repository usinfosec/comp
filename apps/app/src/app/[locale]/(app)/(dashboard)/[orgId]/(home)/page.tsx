import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { FrameworksOverview } from "./components/FrameworksOverview";
import { db } from "@bubba/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	const frameworks = await getFrameworks(organizationId);

	return <FrameworksOverview frameworks={frameworks} />;
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
		title: t("sidebar.overview"),
	};
}

const getFrameworks = async (organizationId: string) => {
	const frameworks = await db.organizationFramework.findMany({
		where: { organizationId: organizationId },
		include: {
			organizationControl: true,
			framework: true,
		},
	});

	return frameworks;
};
