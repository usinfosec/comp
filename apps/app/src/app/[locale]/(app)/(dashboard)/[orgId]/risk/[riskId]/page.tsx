import { auth } from "@/auth";
import { Loading } from "@/components/frameworks/loading";
import { InherentRiskChart } from "@/components/risks/charts/inherent-risk-chart";
import { ResidualRiskChart } from "@/components/risks/charts/residual-risk-chart";
import { RiskOverview } from "@/components/risks/risk-overview";
import type { RiskTaskType } from "@/components/tables/risk-tasks/columns";
import { DataTable } from "@/components/tables/risk-tasks/data-table";
import {
  NoResults,
  NoTasks,
} from "@/components/tables/risk-tasks/empty-states";
import { FilterToolbar } from "@/components/tables/risk-tasks/filter-toolbar";
import { getServerColumnHeaders } from "@/components/tables/risk-tasks/server-columns";
import { useUsers } from "@/hooks/use-users";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { RiskTaskStatus } from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { cache } from "react";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
    page?: string;
    per_page?: string;
  }>;
  params: Promise<{ riskId: string; locale: string }>;
}

export default async function RiskPage({ searchParams, params }: PageProps) {
  const { riskId } = await params;
  const risk = await getRisk(riskId);
  const users = await useUsers();
  const t = await getI18n();

  const {
    search,
    status,
    sort,
    page = "1",
    per_page = "5",
  } = await searchParams;

  const columnHeaders = await getServerColumnHeaders();
  const [column, order] = sort?.split(":") ?? [];
  const hasFilters = !!(search || status);
  const { tasks: loadedTasks, total } = await getTasks({
    riskId,
    search,
    status: status as RiskTaskStatus,
    column,
    order,
    page: Number.parseInt(page),
    per_page: Number.parseInt(per_page),
  });

  if (!risk) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <RiskOverview risk={risk} users={users} />

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between gap-2">
              {t("risk.tasks.title")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <FilterToolbar isEmpty={loadedTasks.length === 0} users={users} />
            {loadedTasks.length > 0 ? (
              <DataTable
                columnHeaders={columnHeaders}
                data={loadedTasks as RiskTaskType[]}
                pageCount={Math.ceil(total / Number.parseInt(per_page))}
                currentPage={Number.parseInt(page)}
              />
            ) : hasFilters ? (
              <NoResults hasFilters={hasFilters} />
            ) : (
              <>
                <NoTasks isEmpty={true} />
                <Loading isEmpty={true} amount={3} />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InherentRiskChart risk={risk} />
        <ResidualRiskChart risk={risk} />
      </div>
    </div>
  );
}

const getRisk = cache(
  async (riskId: string) => {
    const session = await auth();

    if (!session || !session.user.organizationId) {
      return null;
    }

    const risk = await db.risk.findUnique({
      where: {
        id: riskId,
        organizationId: session.user.organizationId,
      },
      include: {
        owner: true,
      },
    });

    return risk;
  },
);

const getTasks = cache(
  async function tasks({
    riskId,
    search,
    status,
    column,
    order,
    page = 1,
    per_page = 10,
  }: {
    riskId: string;
    search?: string;
    status?: RiskTaskStatus;
    column?: string;
    order?: string;
    page?: number;
    per_page?: number;
  }) {
    const session = await auth();

    if (!session || !session.user.organizationId) {
      return { tasks: [], total: 0 };
    }

    const skip = (page - 1) * per_page;

    const [tasks, total] = await Promise.all([
      db.riskMitigationTask
        .findMany({
          where: {
            riskId,
            organizationId: session.user.organizationId,
            AND: [
              search
                ? {
                  OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    {
                      description: { contains: search, mode: "insensitive" },
                    },
                  ],
                }
                : {},
              status ? { status } : {},
            ],
          },
          orderBy: column
            ? {
              [column]: order === "asc" ? "asc" : "desc",
            }
            : {
              createdAt: "desc",
            },
          skip,
          take: per_page,
          include: {
            owner: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        })
        .then((tasks) =>
          tasks.map(
            (task) =>
              ({
                ...task,
                dueDate: task.dueDate?.toISOString() ?? "",
                owner: {
                  name: task.owner?.name ?? "",
                  image: task.owner?.image ?? "",
                },
              }) as RiskTaskType,
          ),
        ),
      db.riskMitigationTask.count({
        where: {
          riskId,
          organizationId: session.user.organizationId,
          AND: [
            search
              ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
              : {},
            status ? { status } : {},
          ],
        },
      }),
    ]);

    return { tasks, total };
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("sub_pages.risk.risk_overview"),
  };
}
