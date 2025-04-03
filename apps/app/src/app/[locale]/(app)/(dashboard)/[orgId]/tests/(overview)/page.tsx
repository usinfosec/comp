import { cache } from "react";
import { auth } from "@comp/auth";
import { TestsSeverity } from "@/components/tests/charts/tests-severity";
import { TestsByAssignee } from "@/components/tests/charts/tests-by-assignee";
import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function TestsOverview({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session?.activeOrganizationId) {
		redirect("/onboarding");
	}

	const overview = await getTestsOverview(session.session.activeOrganizationId);

	if (overview?.totalTests === 0) {
		redirect(`/${session.session.activeOrganizationId}/tests/all`);
	}

	return (
		<div className="space-y-4 sm:space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<TestsSeverity
					totalTests={overview.totalTests}
					infoSeverityTests={overview.infoSeverityTests}
					lowSeverityTests={overview.lowSeverityTests}
					mediumSeverityTests={overview.mediumSeverityTests}
					highSeverityTests={overview.highSeverityTests}
					criticalSeverityTests={overview.criticalSeverityTests}
				/>
				<TestsByAssignee
					organizationId={session.session.activeOrganizationId}
				/>
			</div>
		</div>
	);
}

const getTestsOverview = cache(async (organizationId: string) => {
	return await db.$transaction(async (tx) => {
		const [
			totalTests,
			infoSeverityTests,
			lowSeverityTests,
			mediumSeverityTests,
			highSeverityTests,
			criticalSeverityTests,
		] = await Promise.all([
			tx.integrationResult.count({
				where: {
					organizationId,
				},
			}),
			tx.integrationResult.count({
				where: {
					organizationId,
					severity: "INFO",
				},
			}),
			tx.integrationResult.count({
				where: {
					organizationId,
					severity: "LOW",
				},
			}),
			tx.integrationResult.count({
				where: {
					organizationId,
					severity: "MEDIUM",
				},
			}),
			tx.integrationResult.count({
				where: {
					organizationId,
					severity: "HIGH",
				},
			}),
			tx.integrationResult.count({
				where: {
					organizationId,
					severity: "CRITICAL",
				},
			}),
		]);

		return {
			totalTests,
			infoSeverityTests,
			lowSeverityTests,
			mediumSeverityTests,
			highSeverityTests,
			criticalSeverityTests,
		};
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("sidebar.tests"),
	};
}
