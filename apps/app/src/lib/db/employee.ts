import { db } from "@bubba/db";
import type { Departments, Member } from "@bubba/db/types";
import { InvitePortalEmail } from "@bubba/email/emails/invite-portal";
import { sendEmail } from "@bubba/email/lib/resend";

if (!process.env.NEXT_PUBLIC_PORTAL_URL) {
  throw new Error("NEXT_PUBLIC_PORTAL_URL is not set");
}

const inviteEmployeeToPortal = async (params: {
  email: string;
  organizationName: string;
  inviteLink: string;
}) => {
  const { email, organizationName, inviteLink } = params;

  await sendEmail({
    to: email,
    subject: `You've been invited to join ${organizationName || "an organization"} on Comp AI`,
    react: InvitePortalEmail({
      email,
      organizationName,
      inviteLink,
    }),
  });

  return {
    success: true,
    message: "Employee invited to portal",
  };
};

/**
 * Complete employee creation by handling all steps:
 * 1. Create/reactivate the employee
 * 2. Create/update portal user
 */
export async function completeEmployeeCreation(params: {
  name: string;
  email: string;
  department: Departments;
  organizationId: string;
  externalEmployeeId?: string;
}): Promise<Member | undefined> {
  // check if the user already exists.
  const existingUser = await db.user.findUnique({
    where: {
      email: params.email,
    },
  });

  let employee: Member | undefined;

  if (existingUser) {
    // add them as members to the organization with the employee role.
    const existingMember = await db.member.findFirst({
      where: {
        userId: existingUser.id,
        organizationId: params.organizationId,
      },
    });

    if (!existingMember) {
      // Create a new member record
      employee = await db.member.create({
        data: {
          userId: existingUser.id,
          organizationId: params.organizationId,
          role: "employee",
        },
      });
    } else {
      const existingMemberRoles = existingMember.role.split(",") as (
        | "admin"
        | "auditor"
        | "employee"
      )[];

      // Update existing member with employee role if they don't already have it
      if (!existingMemberRoles.includes("employee")) {
        employee = await db.member.update({
          where: {
            id: existingMember.id,
          },
          data: {
            role: [...existingMemberRoles, "employee"].join(","),
          },
        });
      } else {
        employee = existingMember;
      }
    }
  } else {
    // create a skeleton user.
    const user = await db.user.create({
      data: {
        name: params.name,
        email: params.email,
        emailVerified: false,
      },
    });

    // add them as members to the organization with the employee role.
    employee = await db.member.create({
      data: {
        userId: user.id,
        organizationId: params.organizationId,
        role: "employee",
      },
    });

    if (!employee) {
      throw new Error("Failed to add employee to organization");
    }
  }

  const organization = await db.organization.findUnique({
    where: {
      id: params.organizationId,
    },
  });

  await inviteEmployeeToPortal({
    email: params.email,
    organizationName: organization?.name || "an organization",
    inviteLink: `${process.env.NEXT_PUBLIC_PORTAL_URL}`,
  });

  return employee;
}
