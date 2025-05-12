import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { TestsLayout } from "./components/TestsLayout";

export default async function TestsDashboard() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect("/");
	}

	const orgId = session.session?.activeOrganizationId;
	if (!orgId) {
		return notFound();
	}

	const tests = await getTests(orgId);

	const awsTests = tests.filter(
		(test) => test.integration.integrationId === "aws",
	);
	const gcpTests = tests.filter(
		(test) => test.integration.integrationId === "gcp",
	);
	const azureTests = tests.filter(
		(test) => test.integration.integrationId === "azure",
	);

	return (
		<TestsLayout
			awsTests={awsTests}
			gcpTests={gcpTests}
			azureTests={azureTests}
		/>
	);
}

const getTests = async (orgId: string) => {
	const tests = await db.integrationResult.findMany({
		where: {
			organizationId: orgId,
			integration: {
				integrationId: {
					in: ["aws", "gcp", "azure"],
				},
			},
		},
		select: {
			id: true,
			title: true,
			completedAt: true,
			description: true,
			status: true,
			severity: true,
			remediation: true,
			integration: {
				select: {
					integrationId: true,
				},
			},
		},
	});

	return tests || [];
};
