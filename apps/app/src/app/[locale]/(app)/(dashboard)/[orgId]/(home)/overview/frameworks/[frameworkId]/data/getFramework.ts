import { db } from "@bubba/db";

export const getFramework = async (
  frameworkId: string,
  organizationId: string
) => {
  const framework = await db.organizationFramework.findUnique({
    where: {
      organizationId_frameworkId: {
        organizationId,
        frameworkId,
      },
    },
    include: {
      framework: true,
      organizationControl: true,
    },
  });

  return framework;
};
