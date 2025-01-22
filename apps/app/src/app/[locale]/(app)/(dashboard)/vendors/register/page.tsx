import { auth } from "@/auth";
import { DataTable } from "@/components/tables/vendor-register/data-table";
import {
  NoResults,
  NoVendors,
} from "@/components/tables/vendor-register/empty-states";
import { FilterToolbar } from "@/components/tables/vendor-register/filter-toolbar";
import { Loading } from "@/components/tables/vendor-register/loading";
import { getServerColumnHeaders } from "@/components/tables/vendor-register/server-columns";
import { VendorOverview } from "@/components/vendors/charts/vendor-overview";
import { type VendorCategory, type VendorStatus, db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    sort?: string;
    page?: string;
    per_page?: string;
  }>;
}

export default async function VendorRegisterPage({ searchParams }: PageProps) {
  const session = await auth();
  const organizationId = session?.user.organizationId;
  const columnHeaders = await getServerColumnHeaders();

  if (!organizationId) {
    return redirect("/");
  }

  const {
    search,
    status,
    category,
    sort,
    page = "1",
    per_page = "10",
  } = await searchParams;

  const [column, order] = sort?.split(":") ?? [];

  const hasFilters = !!(search || status || category);

  const { vendors: loadedVendors, total } = await getVendors({
    organizationId,
    search,
    status: status as VendorStatus,
    category: category as VendorCategory,
    column,
    order,
    page: Number.parseInt(page),
    per_page: Number.parseInt(per_page),
  });

  const users = await db.user.findMany({
    where: {
      organizationId,
      Vendors: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (loadedVendors.length === 0 && !hasFilters) {
    return (
      <div className="relative overflow-hidden">
        <FilterToolbar isEmpty={true} users={users} />
        <NoVendors />
        <Loading isEmpty={true} />
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      <FilterToolbar isEmpty={loadedVendors.length === 0} users={users} />
      {loadedVendors.length > 0 ? (
        <DataTable
          columnHeaders={columnHeaders}
          data={loadedVendors}
          pageCount={Math.ceil(total / Number.parseInt(per_page))}
          currentPage={Number.parseInt(page)}
        />
      ) : (
        <NoResults hasFilters={hasFilters} />
      )}
    </div>
  );
}

const getVendors = unstable_cache(
  async function vendors({
    organizationId,
    search,
    status,
    category,
    column,
    order,
    page = 1,
    per_page = 10,
  }: {
    organizationId: string;
    search?: string;
    status?: VendorStatus;
    category?: VendorCategory;
    column?: string;
    order?: string;
    page?: number;
    per_page?: number;
  }) {
    const skip = (page - 1) * per_page;

    const [vendors, total] = await Promise.all([
      db.vendors.findMany({
        where: {
          organizationId,
          AND: [
            search
              ? {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                  ],
                }
              : {},
            status ? { status } : {},
            category ? { category } : {},
          ],
        },
        orderBy: column
          ? {
              [column]: order === "asc" ? "asc" : "desc",
            }
          : undefined,
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
      }),
      db.vendors.count({
        where: {
          organizationId,
          AND: [
            search
              ? {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                  ],
                }
              : {},
            status ? { status } : {},
            category ? { category } : {},
          ],
        },
      }),
    ]);

    return { vendors, total };
  },
  ["vendors-cache"],
);
