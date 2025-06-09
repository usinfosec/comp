import { getInitials } from "@/lib/utils";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { RiskStatus } from "@comp/db/types";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { ScrollArea } from "@comp/ui/scroll-area";
import { headers } from "next/headers";
import Link from "next/link";
import { cache } from "react";

interface UserRiskStats {
	user: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
	};
	totalRisks: number;
	openRisks: number;
	pendingRisks: number;
	closedRisks: number;
	archivedRisks: number;
}

const riskStatusColors = {
	open: "bg-yellow-500",
	pending: "bg-blue-500",
	closed: "bg-green-500",
	archived: "bg-gray-500",
};

export async function RisksAssignee() {
	const userStats = await userData();
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	const stats: UserRiskStats[] = userStats.map((member) => ({
		user: {
			id: member.id,
			name: member.user.name,
			email: member.user.email,
			image: member.user.image,
		},
		totalRisks: member.risks.length,
		openRisks: member.risks.filter((risk) => risk.status === "open").length,
		pendingRisks: member.risks.filter((risk) => risk.status === "pending")
			.length,
		closedRisks: member.risks.filter((risk) => risk.status === "closed").length,
		archivedRisks: member.risks.filter((risk) => risk.status === "archived")
			.length,
	}));

	stats.sort((a, b) => b.totalRisks - a.totalRisks);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Risks by Assignee"}</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea>
					<div className="space-y-4">
						{stats.map((stat) => (
							<Link
								href={`/${orgId}/risk/register?assigneeId=${stat.user.id}`}
								key={stat.user.id}
							>
								<div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
									<Avatar>
										<AvatarImage src={stat.user.image || undefined} />
										<AvatarFallback>
											{getInitials(
												stat.user.name || stat.user.email || "Unknown User",
											)}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between">
											<p className="text-sm font-medium leading-none truncate">
												{stat.user.name || stat.user.email || "Unknown User"}
											</p>
											<span className="text-sm text-muted-foreground">
												{stat.totalRisks} {"risks"}
											</span>
										</div>

										<div className="mt-2 w-full bg-muted rounded-full h-2 overflow-hidden">
											{stat.totalRisks > 0 && (
												<div className="h-full flex">
													{stat.openRisks > 0 && (
														<div
															className={`${riskStatusColors.open} h-full`}
															style={{
																width: `${(stat.openRisks / stat.totalRisks) * 100}%`,
															}}
															title={`${"Open"}: ${stat.openRisks}`}
														/>
													)}
													{stat.pendingRisks > 0 && (
														<div
															className={`${riskStatusColors.pending} h-full`}
															style={{
																width: `${
																	(stat.pendingRisks / stat.totalRisks) * 100
																}%`,
															}}
															title={`${"Pending"}: ${stat.pendingRisks}`}
														/>
													)}
													{stat.closedRisks > 0 && (
														<div
															className={`${riskStatusColors.closed} h-full`}
															style={{
																width: `${(stat.closedRisks / stat.totalRisks) * 100}%`,
															}}
															title={`${"Closed"}: ${stat.closedRisks}`}
														/>
													)}
													{stat.archivedRisks > 0 && (
														<div
															className={`${riskStatusColors.archived} h-full`}
															style={{
																width: `${(stat.archivedRisks / stat.totalRisks) * 100}%`,
															}}
															title={`${"Archived"}: ${stat.archivedRisks}`}
														/>
													)}
												</div>
											)}
										</div>

										<div className="mt-1.5 hidden lg:flex items-center gap-3 text-xs text-muted-foreground">
											{stat.openRisks > 0 && (
												<div className="flex items-center gap-1">
													<div
														className={`size-2 rounded-full ${riskStatusColors.open}`}
													/>
													<span>
														{"Open"} ({stat.openRisks})
													</span>
												</div>
											)}
											{stat.pendingRisks > 0 && (
												<div className="flex items-center gap-1">
													<div
														className={`size-2 rounded-full ${riskStatusColors.pending}`}
													/>
													<span>
														{"Pending"} ({stat.pendingRisks})
													</span>
												</div>
											)}
											{stat.closedRisks > 0 && (
												<div className="flex items-center gap-1">
													<div
														className={`size-2 rounded-full ${riskStatusColors.closed}`}
													/>
													<span>
														{"Closed"} ({stat.closedRisks})
													</span>
												</div>
											)}
											{stat.archivedRisks > 0 && (
												<div className="flex items-center gap-1">
													<div
														className={`size-2 rounded-full ${riskStatusColors.archived}`}
													/>
													<span>
														{"Archived"} ({stat.archivedRisks})
													</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}

const userData = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		return [];
	}

	const members = await db.member.findMany({
		where: {
			organizationId: session.session.activeOrganizationId,
		},
		select: {
			id: true,
			risks: {
				where: {
					organizationId: session.session.activeOrganizationId,
				},
				select: {
					status: true,
				},
			},
			user: {
				select: {
					name: true,
					image: true,
					email: true,
				},
			},
		},
	});

	return members;
});
