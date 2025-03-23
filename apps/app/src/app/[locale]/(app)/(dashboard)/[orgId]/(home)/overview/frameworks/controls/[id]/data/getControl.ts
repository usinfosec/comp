import { auth } from "@/auth";
import { db } from "@bubba/db";

export const getControl = async (id: string) => {
  const session = await auth();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const organizationControl = await db.organizationControl.findUnique({
    where: {
      organizationId: session.user.organizationId,
      id,
    },
    include: {
      control: true,
      OrganizationControlRequirement: {
        include: {
          organizationPolicy: true,
          organizationEvidence: true,
        },
      },
    },
  });

  return organizationControl;
};
