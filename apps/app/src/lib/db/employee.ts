import { auth } from "@comp/auth";
import { db } from "@comp/db";
import type { Departments, Member, Role } from "@comp/db/types";
import { InvitePortalEmail } from "@comp/email/emails/invite-portal";
import { sendEmail } from "@comp/email/lib/resend";
import { revalidatePath } from "next/cache";
import { trainingVideos } from "@comp/data";

if (!process.env.NEXT_PUBLIC_PORTAL_URL) {
  throw new Error("NEXT_PUBLIC_PORTAL_URL is not set");
}

/**
 * Complete employee creation by handling all steps:
 * 1. Create/reactivate the employee
 * 2. Create/update portal user
 * 3. Create training video entries
 */
export async function completeEmployeeCreation(params: {
  name: string;
  email: string;
  department: Departments;
  organizationId: string;
  externalEmployeeId?: string;
}): Promise<Member | undefined> {
  const { name, email, department, organizationId } = params;
  console.log(`Starting employee creation for ${email}`);

  // Check if the user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  let employee: Member;
  let userId: string;

  if (existingUser) {
    // Handle existing user flow
    employee = await handleExistingUser({
      userId: existingUser.id,
      organizationId,
      department,
    });
    userId = existingUser.id;
  } else {
    // Handle new user flow
    employee = await createNewUser({
      name,
      email,
      organizationId,
      department,
    });
    userId = employee.userId;
  }

  // Get organization details for email
  //   const organization = await db.organization.findUnique({
  //     where: { id: organizationId },
  //   });

  // Send portal invitation
  // await inviteEmployeeToPortal({
  // 	email,
  // 	organizationName: organization?.name || "an organization",
  // 	inviteLink: process.env.NEXT_PUBLIC_PORTAL_URL || "",
  // });

  // Create training video entries for the employee
  await createTrainingVideoEntries(employee.id);

  // Revalidate relevant paths to update UI
  revalidatePath(`/${organizationId}/employees`);

  return employee;
}

/**
 * Sends an invitation email to an employee for portal access
 */
async function inviteEmployeeToPortal({
  email,
  organizationName,
  inviteLink,
}: {
  email: string;
  organizationName: string;
  inviteLink: string;
}) {
  console.log(`Sending portal invite to ${email} for ${organizationName}`);

  await sendEmail({
    to: email,
    subject: `You've been invited to join ${organizationName || "an organization"} on Comp AI`,
    react: InvitePortalEmail({
      email,
      organizationName,
      inviteLink,
    }),
  });

  return { success: true };
}

/**
 * Creates training video tracking entries for a new employee
 */
async function createTrainingVideoEntries(employeeId: string) {
  console.log(`Creating training video entries for employee ${employeeId}`);

  // Create an entry for each video in the system
  const result = await db.employeeTrainingVideoCompletion.createMany({
    data: trainingVideos.map((video) => ({
      memberId: employeeId,
      videoId: video.id,
    })),
    skipDuplicates: true,
  });

  console.log(
    `Created ${result.count} training video entries for employee ${employeeId}`
  );

  return result;
}

/**
 * Handle the flow for an existing user
 */
async function handleExistingUser({
  userId,
  organizationId,
  department,
}: {
  userId: string;
  organizationId: string;
  department: Departments;
}): Promise<Member> {
  // Check if user is already a member of the organization
  const existingMember = await db.member.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  if (!existingMember) {
    // Create a new member record if they're not already in the organization
    return await db.member.create({
      data: {
        userId,
        organizationId,
        role: "employee",
        department,
        isActive: true,
      },
    });
  }

  // User is already a member, check if they have employee role
  const existingMemberRoles = existingMember.role.split(",") as (
    | "admin"
    | "auditor"
    | "employee"
  )[];

  if (!existingMemberRoles.includes("employee")) {
    // Update existing member with employee role
    const updatedMember = await auth.api.updateMemberRole({
      body: {
        memberId: existingMember.id,
        organizationId,
        role: [...existingMemberRoles, "employee"],
      },
    });

    if (!updatedMember) {
      throw new Error("Failed to update member role");
    }

    return {
      ...existingMember,
      role: updatedMember.role as Role,
    };
  }

  return existingMember;
}

/**
 * Create a new user and add them as a member
 */
async function createNewUser({
  name,
  email,
  organizationId,
  department,
}: {
  name: string;
  email: string;
  organizationId: string;
  department: Departments;
}): Promise<Member> {
  // Create a skeleton user
  const user = await db.user.create({
    data: {
      name,
      email,
      emailVerified: false,
    },
  });

  // Add them as a member to the organization with the employee role
  const newMember = await db.member.create({
    data: {
      userId: user.id,
      organizationId,
      role: "employee",
      department,
      isActive: true,
    },
  });

  if (!newMember) {
    throw new Error("Failed to add employee to organization");
  }

  return newMember;
}
