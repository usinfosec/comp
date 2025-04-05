import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";
import { InherentRiskChart } from "@/components/risks/charts/inherent-risk-chart";
import { ResidualRiskChart } from "@/components/risks/charts/residual-risk-chart";
import { RiskOverview } from "@/components/risks/risk-overview";
import type { RiskTaskType } from "@/components/tables/risk-tasks/columns";
import { getServerColumnHeaders } from "@/components/tables/risk-tasks/server-columns";
import { getI18n } from "@/locales/server";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { TaskStatus } from "@comp/db/types";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
    page?: string;
    per_page?: string;
  }>;
  params: Promise<{ riskId: string; locale: string; orgId: string }>;
}

export default async function RiskPage({ searchParams, params }: PageProps) {
  const { riskId, orgId } = await params;
  const risk = await getRisk(riskId);

  const assignees = await getAssignees();
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
    status: status as TaskStatus,
    column,
    order,
    page: Number.parseInt(page),
    per_page: Number.parseInt(per_page),
  });

  if (!risk) {
    redirect("/");
  }

  return (
    <PageWithBreadcrumb
      breadcrumbs={[
        { label: "Risks", href: `/${orgId}/risk` },
        { label: risk.title, current: true },
      ]}
    >
      <div className="flex flex-col gap-4">
        <RiskOverview risk={risk} assignees={assignees} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InherentRiskChart risk={risk} />
          <ResidualRiskChart risk={risk} />
        </div>
      </div>
    </PageWithBreadcrumb>
  );
}

async function getRisk(riskId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.session.activeOrganizationId) {
    return null;
  }

  const risk = await db.risk.findUnique({
    where: {
      id: riskId,
      organizationId: session.session.activeOrganizationId,
    },
    include: {
      assignee: {
        include: {
          user: true,
        },
      },
    },
  });

  return risk;
}

async function getTasks({
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
  status?: TaskStatus;
  column?: string;
  order?: string;
  page?: number;
  per_page?: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.session.activeOrganizationId) {
    return { tasks: [], total: 0 };
  }

  const skip = (page - 1) * per_page;

  const [tasks, total] = await Promise.all([
    db.task
      .findMany({
        where: {
          relatedId: riskId,
          relatedType: "risk",
          organizationId: session.session.activeOrganizationId,
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
          assignee: {
            include: {
              user: true,
            },
          },
        },
      })
      .then((tasks) =>
        tasks.map(
          (task): RiskTaskType => ({
            id: task.id,
            riskId: task.relatedId,
            title: task.title,
            status: task.status,
            dueDate: task.dueDate.toISOString(),
            assigneeId: task.assigneeId ?? "",
            assignee: {
              name: task.assignee?.user.name ?? "",
              image: task.assignee?.user.image ?? "",
            },
          }),
        ),
      ),
    db.task.count({
      where: {
        relatedId: riskId,
        relatedType: "risk",
        organizationId: session.session.activeOrganizationId,
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
}

async function getAssignees() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.session.activeOrganizationId) {
    return [];
  }

  const assignees = await db.member.findMany({
    where: {
      organizationId: session.session.activeOrganizationId,
      role: {
        notIn: ["employee"],
      },
    },
    include: {
      user: true,
    },
  });

  return assignees;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("risk.risk_overview"),
  };
}
