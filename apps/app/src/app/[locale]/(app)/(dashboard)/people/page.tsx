import { auth } from "@/auth";
import { type PersonType } from "@/components/tables/people/columns";
import { DataTable } from "@/components/tables/people/data-table";
import {
  NoResults,
  NoEmployees,
} from "@/components/tables/people/empty-states";
import { FilterToolbar } from "@/components/tables/people/filter-toolbar";
import { Loading } from "@/components/tables/people/loading";
import { getServerColumnHeaders } from "@/components/tables/people/server-columns";
import { type Role, db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    page?: string;
    per_page?: string;
  }>;
}

export default async function PeoplePage({ searchParams }: PageProps) {
  try {
    const session = await auth();
    const organizationId = session?.user.organizationId;
    const columnHeaders = await getServerColumnHeaders();

    if (!organizationId) {
      return redirect("/");
    }

    const { search, role, page = "1", per_page = "10" } = await searchParams;

    const hasFilters = !!(search || role);

    const { employees: loadedEmployees = [], total = 0 } = await getEmployees({
      organizationId,
      search,
      role: role as Role,
      page: Number.parseInt(page),
      per_page: Number.parseInt(per_page),
    });

    if (loadedEmployees.length === 0 && !hasFilters) {
      return (
        <div className="relative overflow-hidden">
          <FilterToolbar isEmpty={true} />
          <NoEmployees />
          <Loading isEmpty />
        </div>
      );
    }

    return (
      <div className="relative">
        <FilterToolbar isEmpty={loadedEmployees.length === 0} />
        {loadedEmployees.length > 0 ? (
          <DataTable
            columnHeaders={columnHeaders}
            data={loadedEmployees as PersonType[]}
            pageCount={Math.ceil(total / Number.parseInt(per_page))}
            currentPage={Number.parseInt(page)}
          />
        ) : (
          <NoResults hasFilters={hasFilters} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in PeoplePage:", error);
    return (
      <div className="relative">
        <FilterToolbar isEmpty={true} />
        <NoResults hasFilters={false} />
      </div>
    );
  }
}

const getEmployees = unstable_cache(
  async function employees({
    organizationId,
    search,
    page = 1,
    per_page = 10,
  }: {
    organizationId: string;
    search?: string;
    role?: Role;
    page?: number;
    per_page?: number;
  }) {
    try {
      const skip = (page - 1) * per_page;

      const [employees, total] = await Promise.all([
        db.employee.findMany({
          where: {
            organizationId,
            AND: [
              search
                ? {
                    OR: [
                      { name: { contains: search, mode: "insensitive" } },
                      { email: { contains: search, mode: "insensitive" } },
                    ],
                  }
                : {},
            ],
          },
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
          skip,
          take: per_page,
        }),
        db.employee.count({
          where: {
            organizationId,
            AND: [
              search
                ? {
                    OR: [
                      { name: { contains: search, mode: "insensitive" } },
                      { email: { contains: search, mode: "insensitive" } },
                    ],
                  }
                : {},
            ],
          },
        }),
      ]);

      return { employees, total };
    } catch (error) {
      console.error("Error fetching employees:", error);
      return { employees: [], total: 0 };
    }
  },
  ["employees-cache"]
);
