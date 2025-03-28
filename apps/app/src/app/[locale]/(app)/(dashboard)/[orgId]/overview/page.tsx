import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { FrameworksOverview } from "./components/FrameworksOverview";
import { getFrameworks } from "./data/getFrameworks";
import { getComplianceScores } from "./data/getComplianceScores";
import { getFrameworkCategories } from "./data/getFrameworkCategories";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ locale: string; orgId: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	const frameworks = await getFrameworks(organizationId);
	const complianceScores = await getComplianceScores(
		organizationId,
		frameworks,
	);
	const frameworksWithCompliance = await getFrameworkCategories(
		organizationId,
		frameworks,
	);

	return (
		<FrameworksOverview
			frameworks={frameworks}
			complianceScores={complianceScores}
			frameworksWithCompliance={frameworksWithCompliance}
		/>
	);
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
