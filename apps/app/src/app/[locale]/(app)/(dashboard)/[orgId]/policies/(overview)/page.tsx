import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { Suspense } from "react";
import { PolicyStatusChart } from "./components/policy-status-chart";
import { PolicyAssigneeChart } from "./components/policy-assignee-chart";

export default async function PoliciesOverview({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	const overview = await getPoliciesOverview();

	return (
		<Suspense>
			<div className="space-y-4 sm:space-y-8">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<PolicyStatusChart data={overview} />
					<PolicyAssigneeChart data={overview?.assigneeData} />
				</div>
			</div>
		</Suspense>
	);
}

const getPoliciesOverview = async () => {
	const session = await auth();

	if (!session?.user?.organizationId) {
		return null;
	}

	const organizationId = session.user.organizationId;

	return await db.$transaction(async (tx) => {
		const [
			totalPolicies,
			publishedPolicies,
			draftPolicies,
			archivedPolicies,
			needsReviewPolicies,
			policiesByAssignee,
			policiesByAssigneeStatus,
		] = await Promise.all([
			tx.organizationPolicy.count({
				where: {
					organizationId,
				},
			}),
			tx.organizationPolicy.count({
				where: {
					organizationId,
					status: "published",
				},
			}),
			tx.organizationPolicy.count({
				where: {
					organizationId,
					status: "draft",
				},
			}),
			tx.organizationPolicy.count({
				where: {
					organizationId,
					status: "archived",
				},
			}),
			tx.organizationPolicy.count({
				where: {
					organizationId,
					status: "needs_review",
				},
			}),
			tx.organizationPolicy.groupBy({
				by: ["ownerId"],
				_count: true,
				where: {
					organizationId,
					ownerId: { not: null },
				},
			}),
			tx.organizationPolicy.findMany({
				where: {
					organizationId,
					ownerId: { not: null },
				},
				select: {
					status: true,
					owner: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}),
		]);

		// Transform the data for easier consumption by the chart component
		// First group by owner
		const policyDataByOwner = new Map();

		for (const policy of policiesByAssigneeStatus) {
			if (!policy.owner) continue;

			const ownerId = policy.owner.id;
			if (!policyDataByOwner.has(ownerId)) {
				policyDataByOwner.set(ownerId, {
					id: ownerId,
					name: policy.owner.name || "Unknown",
					total: 0,
					published: 0,
					draft: 0,
					archived: 0,
					needs_review: 0,
				});
			}

			const ownerData = policyDataByOwner.get(ownerId);
			ownerData.total += 1;

			// Handle each status type explicitly
			const status = policy.status as
				| "published"
				| "draft"
				| "archived"
				| "needs_review";
			if (status === "published") ownerData.published += 1;
			else if (status === "draft") ownerData.draft += 1;
			else if (status === "archived") ownerData.archived += 1;
			else if (status === "needs_review") ownerData.needs_review += 1;
		}

		const assigneeData = Array.from(policyDataByOwner.values());

		return {
			totalPolicies,
			publishedPolicies,
			draftPolicies,
			archivedPolicies,
			needsReviewPolicies,
			policiesByAssignee,
			assigneeData,
		};
	});
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("sidebar.policies"),
	};
}
