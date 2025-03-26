"use server";

import { db } from "@bubba/db";

export const getFrameworks = async (organizationId: string) => {
  const frameworks = await db.organizationFramework.findMany({
    where: { organizationId: organizationId },
    include: {
      organizationControl: true,
      framework: true,
    },
  });

  return frameworks;
};
