import { db } from "@comp/db";
import type {
  Member,
  User,
  Policy,
  EmployeeTrainingVideoCompletion,
  Organization
} from "@prisma/client";
import { EmployeeTasksList } from "./EmployeeTasksList";

// Define the type for the member prop passed from Overview
interface MemberWithUserOrg extends Member {
  user: User;
  organization: Organization;
}

interface OrganizationDashboardProps {
  organizationId: string;
  member: MemberWithUserOrg; // Pass the full member object for user info etc.
}

export async function OrganizationDashboard({ organizationId, member }: OrganizationDashboardProps) {

  // Fetch policies specific to the selected organization
  const policies = await db.policy.findMany({
    where: {
      organizationId: organizationId,
      isRequiredToSign: true, // Keep original logic for required policies
    },
  });

  // Fetch training video completions specific to the member
  // Note: The original fetched *all* completions for the member, regardless of org
  // If videos are org-specific, the schema/query might need adjustment
  const trainingVideos = await db.employeeTrainingVideoCompletion.findMany({
    where: {
      memberId: member.id,
      // Add organizationId filter if EmployeeTrainingVideoCompletion has it
      // organizationId: organizationId,
    },
    // Include video details if needed by EmployeeTasksList
    // include: { trainingVideo: true }
  });

  // Display welcome message and tasks
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        {/* Use organization name if available and needed */}
        <p className="text-sm text-muted-foreground">Organization: {member.organization.name}</p>
        <h1 className="text-2xl font-bold">Welcome back, {member.user.name}</h1>
        <p className="text-sm">Please complete the following tasks for {member.organization.name}:</p>
      </div>
      <EmployeeTasksList
        policies={policies}
        trainingVideos={trainingVideos}
        member={member} // Pass the member object down
      />
    </div>
  );
} 