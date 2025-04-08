import { db } from "@comp/db";
import { Prisma, EvidenceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface AssigneeDetails {
	id: string;
	name: string | null;
	email: string | null;
}

interface EvidenceGroupByAssigneeResult {
	assigneeId: string | null;
	_count: {
		_all: number;
	};
}

interface EvidenceGroupByDateResult {
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
			totalEvidence,
			publishedEvidence,
			draftEvidence,
			notRelevantEvidence,
			evidenceByMonthRaw,
			evidenceByAssigneeRaw,
		] = await Promise.all([
			db.evidence.count(),
			db.evidence.count({
				where: { status: EvidenceStatus.published },
			}),
			db.evidence.count({ where: { status: EvidenceStatus.draft } }),
			db.evidence.count({
				where: { status: EvidenceStatus.not_relevant },
			}),
			db.evidence.groupBy({
				by: ["createdAt"],
				_count: { _all: true },
				orderBy: { createdAt: "asc" },
			}),
			db.evidence.groupBy({
				by: ["assigneeId"],
				_count: { _all: true },
			}),
		]);

		const evidenceByMonth = evidenceByMonthRaw as EvidenceGroupByDateResult[];
		const evidenceByAssigneeRawTyped =
			evidenceByAssigneeRaw as EvidenceGroupByAssigneeResult[];

		const evidenceByAssignee = [...evidenceByAssigneeRawTyped].sort(
			(a, b) => b._count._all - a._count._all,
		);

		const assigneeIds = evidenceByAssignee
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
			total: totalEvidence,
			published: publishedEvidence,
			draft: draftEvidence,
			notRelevant: notRelevantEvidence,
			byMonth: evidenceByMonth.map((item) => ({
				date: item.createdAt.toISOString().split("T")[0],
				count: item._count._all,
			})),
			byAssignee: evidenceByAssignee.map((item) => ({
				assignee: item.assigneeId ? assigneeMap[item.assigneeId] : null,
				count: item._count._all,
			})),
		});
	} catch (error) {
		console.error("Error fetching evidence analytics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch evidence analytics" },
			{ status: 500 },
		);
	}
}
