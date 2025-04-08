import { db } from "@comp/db";
import { Prisma, PolicyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface AssigneeDetails {
	id: string;
	name: string | null;
	email: string | null;
}

interface PolicyGroupByAssigneeResult {
	assigneeId: string | null;
	_count: {
		_all: number;
	};
}

interface PolicyGroupByDateResult {
	createdAt: Date;
	_count: {
		_all: number;
	};
}

const ANALYTICS_SECRET = process.env.ANALYTICS_SECRET;

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const secret = searchParams.get("secret");

	if (!ANALYTICS_SECRET || secret !== ANALYTICS_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const [
			totalPolicies,
			publishedPolicies,
			draftPolicies,
			policiesByMonthRaw,
			policiesByAssigneeRaw,
		] = await Promise.all([
			db.policy.count(),
			db.policy.count({
				where: { status: PolicyStatus.published },
			}),
			db.policy.count({ where: { status: PolicyStatus.draft } }),
			db.policy.groupBy({
				by: ["createdAt"],
				_count: { _all: true },
				orderBy: { createdAt: "asc" },
			}),
			db.policy.groupBy({
				by: ["assigneeId"],
				_count: { _all: true },
			}),
		]);

		const policiesByMonth = policiesByMonthRaw as PolicyGroupByDateResult[];
		const policiesByAssigneeRawTyped =
			policiesByAssigneeRaw as PolicyGroupByAssigneeResult[];

		const policiesByAssignee = [...policiesByAssigneeRawTyped].sort(
			(a, b) => b._count._all - a._count._all,
		);

		const assigneeIds = policiesByAssignee
			.map((item) => item.assigneeId)
			.filter((id): id is string => id !== null);

		const assigneeDetails = await db.user.findMany({
			where: { id: { in: assigneeIds } },
			select: { id: true, name: true, email: true },
		});

		const assigneeMap = assigneeDetails.reduce(
			(acc, assignee) => {
				acc[assignee.id] = assignee;
				return acc;
			},
			{} as Record<string, AssigneeDetails>,
		);

		return NextResponse.json({
			total: totalPolicies,
			published: publishedPolicies,
			draft: draftPolicies,
			byMonth: policiesByMonth.map((item) => ({
				date: item.createdAt.toISOString().split("T")[0],
				count: item._count._all,
			})),
			byAssignee: policiesByAssignee.map((item) => ({
				assignee: item.assigneeId ? assigneeMap[item.assigneeId] : null,
				count: item._count._all,
			})),
		});
	} catch (error) {
		console.error("Error fetching policy analytics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch policy analytics" },
			{ status: 500 },
		);
	}
}
