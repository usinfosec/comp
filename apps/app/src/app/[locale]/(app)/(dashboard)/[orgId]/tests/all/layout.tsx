import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { AppOnboarding } from "@/components/app-onboarding";
import { db } from "@bubba/db";
import { cache, Suspense } from "react";
export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();
	const session = await auth();
	const organizationId = session?.user?.organizationId;

	const tests = await getTestsOverview();
	console.log(tests);

	if (!tests.length) {
		return (
			<div className="max-w-[1200px] m-auto">
				<Suspense fallback={<div>Loading...</div>}>
					<div className="mt-8">
						<AppOnboarding
							title={t("app_onboarding.cloud_tests.title")}
							description={t("app_onboarding.cloud_tests.description")}
							imageSrc="/onboarding/cloud-tests.png"
							imageAlt="Cloud Security Testing"
							cta=""
							sheetName=""
							faqs={[
								{
									questionKey: t("app_onboarding.cloud_tests.faqs.question_1"),
									answerKey: t("app_onboarding.cloud_tests.faqs.answer_1"),
								},
								{
									questionKey: t("app_onboarding.cloud_tests.faqs.question_2"),
									answerKey: t("app_onboarding.cloud_tests.faqs.answer_2"),
								},
								{
									questionKey: t("app_onboarding.cloud_tests.faqs.question_3"),
									answerKey: t("app_onboarding.cloud_tests.faqs.answer_3"),
								},
							]}
						/>
					</div>
				</Suspense>
			</div>
		);
	}

	return (
		<div className="max-w-[1200px] mx-auto">
			<SecondaryMenu
				items={[
					{
						path: `/${organizationId}/tests`,
						label: t("tests.dashboard.overview"),
					},
					{
						path: `/${organizationId}/tests/all`,
						label: t("tests.dashboard.all"),
					},
				]}
			/>
			<main className="mt-8">{children}</main>
		</div>
	);
}

const getTestsOverview = cache(async () => {
	const session = await auth();
	const orgId = session?.user.organizationId;

	const tests = await db.organizationIntegrationResults.findMany({
		where: {
			organizationId: orgId,
		},
	});

	return tests;
});
