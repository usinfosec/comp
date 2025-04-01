"use server";

import { auth } from "@/auth";
import { db } from "@bubba/db";

export interface ControlProgressResponse {
  total: number;
  completed: number;
  progress: number;
  byType: {
    [key: string]: {
      total: number;
      completed: number;
    };
  };
}

export const getOrganizationControlProgress = async (controlId: string) => {
  const session = await auth();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const requirements = await db.controlRequirement.findMany({
    where: {
      controlId: controlId,
    },
    include: {
      policy: true,
      evidence: true,
    },
  });

  const progress: ControlProgressResponse = {
    total: requirements.length,
    completed: 0,
    progress: 0,
    byType: {},
  };

  for (const requirement of requirements) {
    // Initialize type counters if not exists
    if (!progress.byType[requirement.type]) {
      progress.byType[requirement.type] = {
        total: 0,
        completed: 0,
      };
    }

    progress.byType[requirement.type].total++;

    // Check completion based on requirement type
    let isCompleted = false;
    switch (requirement.type) {
      case "policy":
        isCompleted = requirement.policy?.status === "published";
        break;
      case "file":
        isCompleted = !!requirement.fileUrl;
        break;
      case "evidence":
        isCompleted = requirement.evidence?.published ?? false;
        break;
      default:
        isCompleted = requirement.published;
    }

    if (isCompleted) {
      progress.completed++;
      progress.byType[requirement.type].completed++;
    }
  }

  // Calculate overall progress percentage
  progress.progress =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return {
    data: {
      progress,
    },
  };
};
