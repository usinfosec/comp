"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import type { Departments, OrganizationEvidence } from "@prisma/client";

export interface EvidenceDashboardData {
  byDepartment: Record<Departments, OrganizationEvidence[]>;
  byAssignee: Record<string, OrganizationEvidence[]>;
  byFramework: Record<string, OrganizationEvidence[]>;
}

export const getEvidenceDashboard = authActionClient
  .metadata({
    name: "getEvidenceDashboard",
    track: {
      event: "get-evidence-dashboard",
      channel: "server",
    },
  })
  .action(async ({ ctx }) => {
    const { user } = ctx;

    if (!user.organizationId) {
      return {
        success: false,
        error: "Not authorized - no organization found",
      };
    }

    try {
      const evidence = await db.organizationEvidence.findMany({
        where: {
          organizationId: user.organizationId,
        },
        include: {
          assignee: true,
        },
      });

      if (!evidence) {
        return {
          success: false,
          error: "Evidence not found",
        };
      }

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
        Record<Departments, OrganizationEvidence[]>
      >(
        (acc, dept) => {
          acc[dept] = [];
          return acc;
        },
        {} as Record<Departments, OrganizationEvidence[]>
      );

      // Group evidence by department
      const byDepartment = evidence.reduce<
        Record<Departments, OrganizationEvidence[]>
      >((acc, curr) => {
        // Use the department from the evidence, or default to 'none' if it's null/undefined
        const department = curr.department || "none";

        // Add the evidence to the appropriate department array
        acc[department].push(curr);
        return acc;
      }, initialByDepartment);

      const byAssignee = evidence.reduce<Record<string, typeof evidence>>(
        (acc, curr) => {
          const assigneeId = curr.assignee?.email;
          if (!assigneeId) {
            return acc;
          }

          if (!acc[assigneeId]) {
            acc[assigneeId] = [];
          }
          acc[assigneeId].push(curr);
          return acc;
        },
        {}
      );

      const byFramework = evidence.reduce<Record<string, typeof evidence>>(
        (acc, curr) => {
          const frameworkId = curr.frameworkId;
          if (!frameworkId) {
            return acc;
          }

          if (!acc[frameworkId]) {
            acc[frameworkId] = [];
          }
          acc[frameworkId].push(curr);
          return acc;
        },
        {}
      );

      return {
        success: true,
        data: {
          byDepartment,
          byAssignee,
          byFramework,
        },
      };
    } catch (error) {
      console.error("Error fetching evidence:", error);
      return {
        success: false,
        error: "Failed to fetch evidence",
      };
    }
  });
