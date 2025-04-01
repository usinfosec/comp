import { auth } from "@/auth/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { headers } from "next/headers";
import { cache, type CSSProperties } from "react";
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
  open: "bg-[var(--chart-open)]",
  pending: "bg-[var(--chart-pending)]",
  closed: "bg-[var(--chart-closed)]",
  archived: "bg-[var(--chart-archived)]",
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
        <div className="space-y-8">
          {stats.map((stat) => (
            <div key={stat.user.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm">{stat.user.name || "Unknown User"}</p>
                <span className="text-sm text-muted-foreground">
                  {stat.totalRisks} {t("risk.risks")}
                </span>
              </div>

              <RiskBarChart stat={stat} t={t} />

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="size-2  bg-[var(--chart-open)]" />
                  <span>
                    {t("common.status.open")} ({stat.openRisks})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2  bg-[var(--chart-pending)]" />
                  <span>
                    {t("common.status.pending")} ({stat.pendingRisks})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2  bg-[var(--chart-closed)]" />
                  <span>
                    {t("common.status.closed")} ({stat.closedRisks})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="size-2  bg-[var(--chart-archived)]" />
                  <span>
                    {t("common.status.archived")} ({stat.archivedRisks})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskBarChart({ stat, t }: { stat: UserRiskStats; t: any }) {
  const data = [
    ...(stat.openRisks > 0
      ? [
        {
          key: "open",
          value: stat.openRisks,
          color: riskStatusColors.open,
          label: t("common.status.open"),
        },
      ]
      : []),
    ...(stat.pendingRisks > 0
      ? [
        {
          key: "pending",
          value: stat.pendingRisks,
          color: riskStatusColors.pending,
          label: t("common.status.pending"),
        },
      ]
      : []),
    ...(stat.closedRisks > 0
      ? [
        {
          key: "closed",
          value: stat.closedRisks,
          color: riskStatusColors.closed,
          label: t("common.status.closed"),
        },
      ]
      : []),
    ...(stat.archivedRisks > 0
      ? [
        {
          key: "archived",
          value: stat.archivedRisks,
          color: riskStatusColors.archived,
          label: t("common.status.archived"),
        },
      ]
      : []),
  ];

  const gap = 0.3;
  const totalValue = stat.totalRisks;
  const barHeight = 12;
  const totalWidth = totalValue + gap * (data.length - 1);
  let cumulativeWidth = 0;
  const cornerRadius = 0;

  if (totalValue === 0) {
    return <div className="h-3 bg-muted" />;
  }

  return (
    <div
      className="relative h-[var(--height)]"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "0px",
          "--marginLeft": "0px",
          "--height": `${barHeight}px`,
        } as CSSProperties
      }
    >
      <div
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        {data.map((d, index) => {
          const barWidth = (d.value / totalWidth) * 100;
          const xPosition = cumulativeWidth;
          cumulativeWidth += barWidth + gap;

          return (
            <div
              key={d.key}
              className="relative"
              style={{
                width: `${barWidth}%`,
                height: `${barHeight}px`,
                left: `${xPosition}%`,
                position: "absolute",
              }}
            >
              <div
                className={`bg-gradient-to-b ${d.color}`}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: `${cornerRadius}px`,
                }}
                title={`${d.label}: ${d.value}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const userData = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.organizationId) {
    return [];
  }

  return await db.user.findMany({
    where: {
      organizationId: session.user.organizationId,
      risk: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      risk: {
        select: {
          status: true,
        },
      },
    },
  });
});
