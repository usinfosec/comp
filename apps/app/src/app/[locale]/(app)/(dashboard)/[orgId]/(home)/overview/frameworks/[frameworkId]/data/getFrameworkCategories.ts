import { db } from "@bubba/db";
import type {
  OrganizationControl,
  OrganizationControlRequirement,
  Control,
  OrganizationCategory,
  OrganizationPolicy,
  OrganizationEvidence,
} from "@bubba/db/types";

export type FrameworkCategories = (OrganizationCategory & {
  name: string;
  organizationControl: (OrganizationControl & {
    id: string;
    status: any; // ComplianceStatus enum
    control: Control;
    OrganizationControlRequirement: (OrganizationControlRequirement & {
      organizationPolicy: OrganizationPolicy | null;
      organizationEvidence: OrganizationEvidence | null;
    })[];
  })[];
})[];

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
              organizationPolicy: true,
              organizationEvidence: true,
            },
          },
        },
      },
    },
  });

  return organizationCategories;
};
