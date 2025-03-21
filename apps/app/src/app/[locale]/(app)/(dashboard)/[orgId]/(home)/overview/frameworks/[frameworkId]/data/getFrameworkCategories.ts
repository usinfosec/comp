import { db } from "@bubba/db";

export const getFrameworkCategories = async (
  frameworkId: string,
  organizationId: string
) => {
  const organizationCategories = await db.organizationCategory.findMany({
    where: {
      organizationId,
      frameworkId,
    },
    include: {
      organizationControl: {
        include: {
          control: true,
          OrganizationControlRequirement: {
            include: {
              organizationPolicy: {
                select: {
                  status: true,
                },
              },
              organizationEvidence: {
                select: {
                  published: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return organizationCategories;
};
