"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import { Departments, Prisma, RiskStatus } from "@bubba/db/types";
import { z } from "zod";

export const getRisks = authActionClient
  .schema(
    z.object({
      search: z.string().optional(),
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(10),
      status: z.nativeEnum(RiskStatus).nullable().optional(),
      department: z.nativeEnum(Departments).nullable().optional(),
      assigneeId: z.string().nullable().optional(),
    })
  )
  .metadata({
    name: "get-risks",
    track: {
      event: "get-risks",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { search, page, pageSize, status, department, assigneeId } =
      parsedInput;
    const { user } = ctx;

    if (!user.organizationId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const where = {
      organizationId: user.organizationId,
      ...(search && {
        title: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(status ? { status } : {}),
      ...(department ? { department } : {}),
      ...(assigneeId ? { ownerId: assigneeId } : {}),
    };

    const skip = (page - 1) * (pageSize ?? 10);

    const risks = await db.risk.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        owner: true,
      },
    });

    return {
      data: risks,
    };
  });
