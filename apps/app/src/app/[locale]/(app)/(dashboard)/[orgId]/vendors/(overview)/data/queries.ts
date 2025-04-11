import { db } from "@comp/db";
import type { Member, User } from "@comp/db/types";
import { cache } from "react";
import type { GetVendorsSchema } from "./validations";
import type { Vendor } from "@comp/db/types"; // Import Vendor type

// Define and export return types used by the functions below
export type GetVendorsResult = {
  data: (Vendor & { assignee: { user: User | null; id: string } | null })[];
  totalCount: number;
  pageSize: number;
};
export type GetAssigneesResult = (Member & { user: User })[];

export const getVendors = cache(
  async (
    orgId: string,
    searchParams: GetVendorsSchema
  ): Promise<GetVendorsResult> => {
    const {
      page,
      pageSize,
      status,
      department,
      assigneeId,
      filters,
      sort,
      name,
    } = searchParams;

    const whereClause: any = {
      organizationId: orgId,
      ...(status && { status: status }),
      ...(department && { department: department }),
      ...(assigneeId && { assigneeId: assigneeId }),
      ...(name && { name: { contains: name, mode: "insensitive" } }),
    };

    if (filters) {
      // Logic to parse the filters array and add to whereClause
    }

    const totalCount = await db.vendor.count({ where: whereClause });

    const vendors = await db.vendor.findMany({
      where: whereClause,
      include: {
        assignee: {
          select: {
            user: true,
            id: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      // TODO: Implement sorting based on `sort` array
    });

    return {
      data: vendors as GetVendorsResult["data"],
      totalCount,
      pageSize,
    };
  }
);

export const getAssignees = cache(
  async (orgId: string): Promise<GetAssigneesResult> => {
    const assignees = await db.member.findMany({
      where: {
        organizationId: orgId,
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
);
