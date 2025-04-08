import { db } from "@comp/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Types for groupBy results
interface UsersGroupByDateResult {
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
		const [totalUsers, activeUsers, usersByMonthRaw] = await Promise.all([
			db.user.count(), // Removed where clause
			db.user.count({
				where: { sessions: { some: { expiresAt: { gt: new Date() } } } },
			}), // Removed organizationId
			db.user.groupBy({
				by: ["createdAt"],
				// Removed where clause
				_count: { _all: true },
				orderBy: { createdAt: "asc" },
			}),
		]);

		const usersByMonth = usersByMonthRaw as UsersGroupByDateResult[];

		return NextResponse.json({
			total: totalUsers,
			active: activeUsers,
			byMonth: usersByMonth.map((item) => ({
				date: item.createdAt.toISOString().split("T")[0],
				count: item._count._all,
			})),
		});
	} catch (error) {
		console.error("Error fetching user analytics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user analytics" },
			{ status: 500 },
		);
	}
}
