import { AppOnboarding } from "@/components/app-onboarding";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CloudTests({
	params,
}: {
	params: Promise<{ locale: string; orgId: string }>;
}) {
	const { locale, orgId } = await params;
	setStaticParamsLocale(locale);

	const cloudProviders = await getCloudProviders();

	if (cloudProviders.length > 0) {
		return redirect(`/${orgId}/tests/dashboard`);
	}

	return (
		<div className="max-w-[1200px] m-auto">
			<AppOnboarding
				title={"Cloud Compliance"}
				description={"Test and validate your cloud infrastructure security with automated tests and reports."}
				imageSrcLight="/onboarding/cloud-light.webp"
				imageSrcDark="/onboarding/cloud-dark.webp"
				imageAlt="Cloud Management"
				sheetName="create-cloud-test-sheet"
				cta="Connect Cloud"
				href={`/${orgId}/integrations`}
				faqs={[
					{
						questionKey: t(
							"app_onboarding.cloud_tests.faqs.question_1",
						),
						answerKey: t(
							"app_onboarding.cloud_tests.faqs.answer_1",
						),
					},
					{
						questionKey: t(
							"app_onboarding.cloud_tests.faqs.question_2",
						),
						answerKey: t(
							"app_onboarding.cloud_tests.faqs.answer_2",
						),
					},
					{
						questionKey: t(
							"app_onboarding.cloud_tests.faqs.question_3",
						),
						answerKey: t(
							"app_onboarding.cloud_tests.faqs.answer_3",
						),
					},
				]}
			/>
		</div>
	);
}

const getCloudProviders = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return [];
	}

	const orgId = session.session?.activeOrganizationId;

	if (!orgId) {
		return [];
	}

	const cloudProviders = await db.integration.findMany({
		where: {
			organizationId: orgId,
			integrationId: {
				in: ["aws", "gcp", "azure"],
			},
		},
	});

	return cloudProviders;
};
