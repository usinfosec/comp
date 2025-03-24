import { auth } from "@/auth";
import { Loading } from "@/components/frameworks/loading";
// import { VendorOverview } from "@/components/vendors/vendor-overview";
import type { VendorTaskType } from "@/components/tables/vendor-tasks/columns";
import { DataTable } from "@/components/tables/vendor-tasks/data-table";
import { NoResults, NoTasks } from "@/components/tables/vendor-tasks/empty-states";
import { FilterToolbar } from "@/components/tables/vendor-tasks/filter-toolbar";
import { getServerColumnHeaders } from "@/components/tables/vendor-tasks/server-columns";
import { VendorOverview } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/components/charts/vendor-overview";
// import { DataTable } from "@/components/tables/vendor-tasks/data-table";
// import {
//   NoResults,
//   NoTasks,
// } from "@/components/tables/vendor-tasks/empty-states";
// import { FilterToolbar } from "@/components/tables/vendor-tasks/filter-toolbar";
// import { getServerColumnHeaders } from "@/components/tables/vendor-tasks/server-columns";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { VendorTaskStatus } from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
    page?: string;
    per_page?: string;
  }>;
  params: Promise<{ vendorId: string; locale: string }>;
}

export default async function VendorPage({ searchParams, params }: PageProps) {
  const session = await auth();
  const t = await getI18n();
  const { vendorId } = await params;
  if (!session) {
    redirect("/auth");
  }

  if (!session.user.organizationId || !vendorId) {
    redirect("/");
  }

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

  const vendor = await db.vendor.findUnique({
    where: {
      id: vendorId,
      organizationId: session.user.organizationId,
    },
    include: {
      owner: true,
    },
  });

  if (!vendor) {
    redirect("/vendors");
  }

  const users = await db.user.findMany({
    where: { organizationId: session.user.organizationId },
  });

  const tasks = await db.vendorTask.findMany({
    where: {
      vendorId: vendorId,
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        status ? { status: status as VendorTaskStatus } : {},
      ],
    },
    orderBy: column
      ? {
          [column]: order === "asc" ? "asc" : "desc",
        }
      : {
          createdAt: "desc",
        },
    skip: (Number(page) - 1) * Number(per_page),
    take: Number(per_page),
    include: {
      owner: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const total = await db.vendorTask.count({
    where: {
      vendorId: vendorId,
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        status ? { status: status as VendorTaskStatus } : {},
      ],
    },
  });

  const loadedTasks = tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate?.toISOString() ?? "",
    owner: {
      name: task.owner?.name ?? "",
      image: task.owner?.image ?? "",
    },
  })) as VendorTaskType[];

  return (
    <div className="flex flex-col gap-4">
      <VendorOverview vendor={vendor} users={users} />

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between gap-2">
              {t("vendors.tasks.title")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <FilterToolbar isEmpty={loadedTasks.length === 0} users={users} />
            {loadedTasks.length > 0 ? (
              <DataTable
                columnHeaders={columnHeaders}
                data={loadedTasks}
                pageCount={Math.ceil(total / Number(per_page))}
                currentPage={Number(page)}
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
    </div>
  );
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
    title: t("vendors.title"),
  };
}
