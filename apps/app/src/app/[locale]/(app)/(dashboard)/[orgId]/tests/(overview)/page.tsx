import { auth } from "@/auth";
import { TestsSeverity } from "@/components/tests/charts/tests-severity";
import { TestsByAssignee } from "@/components/tests/charts/tests-by-assignee";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

export default async function TestsOverview({
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

	const overview = await getTestsOverview(session.user.organizationId);

	if (overview?.totalTests === 0) {
		redirect(`/${session.user.organizationId}/tests/all`);
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
				<TestsByAssignee organizationId={session.user.organizationId} />
			</div>
		</div>
	);
}

const getTestsOverview = unstable_cache(
	async (organizationId: string) => {
		return await db.$transaction(async (tx) => {
			const [
				totalTests,
				infoSeverityTests,
				lowSeverityTests,
				mediumSeverityTests,
				highSeverityTests,
				criticalSeverityTests,
			] = await Promise.all([
				tx.organizationIntegrationResults.count({
					where: {
						organizationId,
					},
				}),
				tx.organizationIntegrationResults.count({
					where: {
						organizationId,
						label: "INFO",
					},
				}),
				tx.organizationIntegrationResults.count({
					where: {
						organizationId,
						label: "LOW",
					},
				}),
				tx.organizationIntegrationResults.count({
					where: {
						organizationId,
						label: "MEDIUM",
					},
				}),
				tx.organizationIntegrationResults.count({
					where: {
						organizationId,
						label: "HIGH",
					},
				}),
				tx.organizationIntegrationResults.count({
					where: {
						organizationId,
						label: "CRITICAL",
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
	},
	["tests-overview-cache"],
);

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
