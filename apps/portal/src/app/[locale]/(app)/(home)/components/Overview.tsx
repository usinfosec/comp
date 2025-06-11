import { auth } from "@/app/lib/auth";
import { db } from "@comp/db";
// Import types directly from @prisma/client
import type {
  Member,
  User,
  Policy,
  EmployeeTrainingVideoCompletion,
  Organization,
} from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// Removed EmployeeTasksList import as it's not used directly here
import { NoAccessMessage } from "./NoAccessMessage";
// Removed OrganizationSelector import
import { OrganizationDashboard } from "./OrganizationDashboard";

// Define the type for the member prop including the user and organization relations
interface MemberWithUserOrg extends Member {
  user: User;
  organization: Organization;
}

// Removed OverviewProps interface and searchParams prop
// export async function Overview({ searchParams }: OverviewProps) {
export async function Overview() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login"); // Or appropriate login/auth route
  }

  // Fetch all memberships for the user, including organization details
  const memberships = await db.member.findMany({
    where: {
      userId: session.user.id,
      // We might want to filter by role if needed, but let's see all memberships first
      // role: "employee", // Keep commented unless needed
    },
    include: {
      user: true,
      organization: true, // Include organization details
    },
  });

  // Case 1: No memberships found
  if (memberships.length === 0) {
    return <NoAccessMessage />;
  }

  // Filter memberships to only those with valid organization data
  const validMemberships = memberships.filter(
    (member): member is MemberWithUserOrg & { organization: Organization } =>
      Boolean(member.organization)
  );

  // If after filtering, there are no valid memberships with organizations
  if (validMemberships.length === 0) {
     // This case might indicate memberships exist but lack organization links
    console.warn("User has memberships but none with associated organizations.", { userId: session.user.id });
    return <NoAccessMessage message="You don't seem to belong to any organizations currently." />;
  }


  // Render a dashboard for each valid membership
  return (
    <div className="space-y-8"> {/* Added a wrapper div with spacing */}
      {validMemberships.map((member) => (
        <OrganizationDashboard
          key={member.organizationId} // Use organizationId as key
          organizationId={member.organizationId}
          member={member} // Pass the full member object (already includes org)
        />
      ))}
    </div>
  );

  // Removed the logic for OrganizationSelector and single/selected org handling
  /*
  // Extract unique organizations
  const organizations = memberships.reduce((acc, member) => {
    if (member.organization && !acc.some(org => org.id === member.organizationId)) {
      acc.push(member.organization);
    }
    return acc;
  }, [] as Organization[]);


  const selectedOrgId = searchParams?.orgId as string | undefined;

  // Case 2: Multiple organizations, and none selected yet OR selected is invalid
  if (organizations.length > 1) {
    const isValidSelection = selectedOrgId && organizations.some(org => org.id === selectedOrgId);

    if (!isValidSelection) {
      // If multiple orgs and no valid selection, show selector
      return <OrganizationSelector organizations={organizations} />;
    }
    // If valid selection, proceed to find member and render dashboard (handled below)
  }

  // Case 3: Exactly one organization OR multiple orgs with a valid selection
  let targetOrgId: string | undefined = undefined;
  let targetMember: MemberWithUserOrg | undefined = undefined;

  if (organizations.length === 1) {
    targetOrgId = organizations[0].id;
    // Find the specific membership for this single organization
    targetMember = memberships.find(m => m.organizationId === targetOrgId);
  } else if (selectedOrgId) {
    // Already validated that selectedOrgId is one of the user's orgs
    targetOrgId = selectedOrgId;
    targetMember = memberships.find(m => m.organizationId === targetOrgId);
  }

  // If we have a target organization and member, render the dashboard
  if (targetOrgId && targetMember) {
     // We need the full MemberWithUserOrg type here potentially
     // Ensure targetMember is correctly typed if OrganizationDashboard expects more
    return <OrganizationDashboard organizationId={targetOrgId} member={targetMember as MemberWithUserOrg} />;
  }

  // Fallback case (should ideally not be reached with the logic above)
  // If multiple orgs but somehow didn't render selector or dashboard
  if (organizations.length > 1) {
     return <OrganizationSelector organizations={organizations} />;
  }

  // If single org but couldn't find member (data inconsistency?)
  // Or some other unexpected state
  console.error("Unexpected state in Overview component", { userId: session.user.id, memberships });
  return <NoAccessMessage message="An unexpected error occurred. Please contact support." />; // Or a more specific error
  */
}
