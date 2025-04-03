import { getInitials } from "@/lib/utils";
import { getI18n } from "@/locales/server";
import { auth } from "@comp/auth";
import { db } from "@comp/db";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { ScrollArea } from "@comp/ui/scroll-area";
import { headers } from "next/headers";
import { cache } from "react";
import type { RiskStatus } from "@comp/db/types";
import Link from "next/link";

interface UserRiskStats {
	user: {
		id: string;
		name: string | null;
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
	const t = await getI18n();
	const userStats = await userData();

	const stats: UserRiskStats[] = userStats.map((user) => ({
		user: {
			id: user.id,
			name: user.name,
			image: user.image,
		},
		totalRisks: user.risk.length,
		openRisks: user.risk.filter((risk) => risk.status === "open").length,
		pendingRisks: user.risk.filter((risk) => risk.status === "pending").length,
		closedRisks: user.risk.filter((risk) => risk.status === "closed").length,
		archivedRisks: user.risk.filter((risk) => risk.status === "archived")
			.length,
	}));

	stats.sort((a, b) => b.totalRisks - a.totalRisks);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("risk.dashboard.risks_by_assignee")}</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea>
					<div className="space-y-4">
						{stats.map((stat) => (
							<Link
								href={`/risk/register?ownerId=${stat.user.id}`}
								key={stat.user.id}
							>
								<div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
									<Avatar>
										<AvatarImage src={stat.user.image || undefined} />
										<AvatarFallback>
											{getInitials(stat.user.name || "Unknown User")}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between">
											<p className="text-sm font-medium leading-none truncate">
												{stat.user.name || "Unknown User"}
											</p>
											<span className="text-sm text-muted-foreground">
												{stat.totalRisks} {t("risk.risks")}
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
															title={`${t("common.status.open")}: ${stat.openRisks}`}
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
															title={`${t("common.status.pending")}: ${stat.pendingRisks}`}
														/>
													)}
													{stat.closedRisks > 0 && (
														<div
															className={`${riskStatusColors.closed} h-full`}
															style={{
																width: `${(stat.closedRisks / stat.totalRisks) * 100}%`,
															}}
															title={`${t("common.status.closed")}: ${stat.closedRisks}`}
														/>
													)}
													{stat.archivedRisks > 0 && (
														<div
															className={`${riskStatusColors.archived} h-full`}
															style={{
																width: `${(stat.archivedRisks / stat.totalRisks) * 100}%`,
															}}
															title={`${t("common.status.archived")}: ${stat.archivedRisks}`}
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
														{t("common.status.open")} ({stat.openRisks})
													</span>
												</div>
											)}
											{stat.pendingRisks > 0 && (
												<div className="flex items-center gap-1">
													<div
														className={`size-2 rounded-full ${riskStatusColors.pending}`}
													/>
													<span>
														{t("common.status.pending")} ({stat.pendingRisks})
													</span>
												</div>
											)}
											{stat.closedRisks > 0 && (
												<div className="flex items-center gap-1">
													<div
														className={`size-2 rounded-full ${riskStatusColors.closed}`}
													/>
													<span>
														{t("common.status.closed")} ({stat.closedRisks})
													</span>
												</div>
											)}
											{stat.archivedRisks > 0 && (
												<div className="flex items-center gap-1">
													<div
														className={`size-2 rounded-full ${riskStatusColors.archived}`}
													/>
													<span>
														{t("common.status.archived")} ({stat.archivedRisks})
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

	return await db.user.findMany({
		where: {
			members: {
				some: {
					organizationId: session.session.activeOrganizationId,
				},
			},
			risk: {
				some: {
					organizationId: session.session.activeOrganizationId,
				},
			},
		},
		select: {
			id: true,
			name: true,
			image: true,
			risk: {
				where: {
					organizationId: session.session.activeOrganizationId,
				},
				select: {
					status: true,
				},
			},
		},
	});
});
