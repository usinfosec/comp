import type { Departments, OrganizationEvidence } from "@bubba/db/types";
import { db } from "@bubba/db";

export type EvidenceStatus = "empty" | "draft" | "needsReview" | "upToDate";

export interface EvidenceWithStatus
  extends Omit<OrganizationEvidence, "assignee"> {
  status: EvidenceStatus;
  assigneeEmail?: string;
}

export interface EvidenceDashboardData {
  byDepartment: Record<Departments, EvidenceWithStatus[]>;
  byAssignee: Record<string, EvidenceWithStatus[]>;
  byFramework: Record<string, EvidenceWithStatus[]>;
  unassigned: EvidenceWithStatus[];
  statusCounts: {
    totalCount: number;
    emptyCount: number;
    draftCount: number;
    needsReviewCount: number;
    upToDateCount: number;
  };
}

/**
 * Get the evidence dashboard data for a given organization
 * @param organizationId - The ID of the organization to get the evidence for
 * @returns The evidence dashboard data for the given organization
 */
export const getEvidenceDashboard = async (
  organizationId: string
): Promise<EvidenceDashboardData | null> => {
  const evidence = await db.organizationEvidence.findMany({
    where: {
      organizationId,
    },
    include: {
      assignee: true,
    },
  });

  if (!evidence) {
    return null;
  }

  // Calculate status for each evidence item
  const now = new Date();
  let emptyCount = 0;
  let draftCount = 0;
  let needsReviewCount = 0;
  let upToDateCount = 0;
  const totalCount = evidence.length;

  const evidenceWithStatus: EvidenceWithStatus[] = evidence.map((item) => {
    // Check if task has files or links
    const hasContent =
      item.fileUrls.length > 0 || item.additionalUrls.length > 0;

    // Check if task is published
    const isPublished = item.published;

    // Check if task needs review (published and next review date is in the past)
    let nextReviewDate = null;

    if (item.lastPublishedAt && item.frequency) {
      // Calculate next review date based on last published date and frequency
      const lastPublished = new Date(item.lastPublishedAt);
      nextReviewDate = new Date(lastPublished);

      switch (item.frequency) {
        case "monthly":
          nextReviewDate.setMonth(nextReviewDate.getMonth() + 1);
          break;
        case "quarterly":
          nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
          break;
        case "yearly":
          nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
          break;
      }
    }

    const isPastDue = nextReviewDate && nextReviewDate < now;

    let status: EvidenceStatus;

    if (!hasContent && !isPublished) {
      // No files or links
      status = "empty";
      emptyCount++;
    } else if (!isPublished) {
      // Has content but not published
      status = "draft";
      draftCount++;
    } else if (isPastDue) {
      // Published but needs review
      status = "needsReview";
      needsReviewCount++;
    } else {
      // Published and up to date
      status = "upToDate";
      upToDateCount++;
    }

    // Extract assignee email if available
    const assigneeEmail = item.assignee?.email || undefined;

    // Create a new object without the assignee property
    const { assignee, ...evidenceWithoutAssignee } = item;

    return {
      ...evidenceWithoutAssignee,
      status,
      assigneeEmail,
    };
  });

  // Initialize with all department values from the enum
  const departmentValues: Departments[] = [
    "none",
    "admin",
    "gov",
    "hr",
    "it",
    "itsm",
    "qms",
  ];

  // Initialize the byDepartment object with empty arrays for all departments
  const initialByDepartment = departmentValues.reduce<
    Record<Departments, EvidenceWithStatus[]>
  >(
    (acc, dept) => {
      acc[dept] = [];
      return acc;
    },
    {} as Record<Departments, EvidenceWithStatus[]>
  );

  // Group evidence by department
  const byDepartment = evidenceWithStatus.reduce<
    Record<Departments, EvidenceWithStatus[]>
  >((acc, curr) => {
    // Use the department from the evidence, or default to 'none' if it's null/undefined
    const department = curr.department || "none";

    // Add the evidence to the appropriate department array
    acc[department].push(curr);
    return acc;
  }, initialByDepartment);

  // Collect unassigned evidence
  const unassigned = evidenceWithStatus.filter((item) => !item.assigneeId);

  // Group evidence by assignee
  const byAssignee = evidenceWithStatus.reduce<
    Record<string, EvidenceWithStatus[]>
  >((acc, curr) => {
    if (!curr.assigneeId || !curr.assigneeEmail) {
      return acc;
    }

    const email = curr.assigneeEmail;
    if (!acc[email]) {
      acc[email] = [];
    }
    acc[email].push(curr);
    return acc;
  }, {});

  // Sample the first assignee's data
  const firstAssigneeEmail = Object.keys(byAssignee)[0];
  if (firstAssigneeEmail) {
    const firstAssigneeItems = byAssignee[firstAssigneeEmail];
    // Count items by status for the first assignee
    const statusCounts = {
      empty: 0,
      draft: 0,
      needsReview: 0,
      upToDate: 0,
    };

    for (const item of firstAssigneeItems) {
      statusCounts[item.status]++;
    }
  }

  const byFramework = evidenceWithStatus.reduce<
    Record<string, EvidenceWithStatus[]>
  >((acc, curr) => {
    const frameworkId = curr.frameworkId;
    if (!frameworkId) {
      return acc;
    }

    if (!acc[frameworkId]) {
      acc[frameworkId] = [];
    }
    acc[frameworkId].push(curr);
    return acc;
  }, {});

  return {
    byDepartment,
    byAssignee,
    byFramework,
    unassigned,
    statusCounts: {
      totalCount,
      emptyCount,
      draftCount,
      needsReviewCount,
      upToDateCount,
    },
  };
};
