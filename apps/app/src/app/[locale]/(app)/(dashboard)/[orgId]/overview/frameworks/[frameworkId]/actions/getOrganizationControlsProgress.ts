"use server";

import { authActionClient } from "@/actions/safe-action";
import { controls } from "@bubba/data";
import { db } from "@bubba/db";
import { z } from "zod";

const schema = z.object({
  controlIds: z.array(z.string()),
});

export interface ControlProgress {
  controlId: string;
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

export const getOrganizationControlsProgress = authActionClient
  .schema(schema)
  .metadata({
    name: "getOrganizationControlsProgress",
    track: {
      event: "get-organization-controls-progress",
      channel: "server",
    },
  })
  .action(async ({ ctx, parsedInput }) => {
    const { user } = ctx;
    const { controlIds } = parsedInput;

    if (!user.organizationId) {
      return {
        error: "Not authorized - no organization found",
      };
    }

    try {
      // Get controls with their artifacts from the database
      const controlsWithArtifacts = await db.control.findMany({
        where: {
          id: {
            in: controlIds,
          },
          organizationId: user.organizationId,
        },
        include: {
          artifacts: {
            include: {
              policy: true,
              evidence: true,
            },
          },
        },
      });

      const progressByControl = new Map<string, ControlProgress>();

      // Initialize progress for all requested controls
      for (const controlId of controlIds) {
        progressByControl.set(controlId, {
          controlId,
          total: 0,
          completed: 0,
          progress: 0,
          byType: {},
        });
      }

      // Calculate progress for each control based on its artifacts
      for (const control of controlsWithArtifacts) {
        const progress = progressByControl.get(control.id);

        if (!progress) continue; // Skip if this control wasn't requested

        if (control.status === "compliant") {
          // If the control is marked as compliant directly, count it as fully complete
          progress.total = 1;
          progress.completed = 1;
          progress.progress = 100;
          continue;
        }

        // Count artifacts by type and check their completion status
        for (const artifact of control.artifacts) {
          const artifactType = artifact.type;

          // Initialize type counters if not exists
          if (!progress.byType[artifactType]) {
            progress.byType[artifactType] = {
              total: 0,
              completed: 0,
            };
          }

          progress.total++;
          progress.byType[artifactType].total++;

          // Check completion based on artifact type
          let isCompleted = false;
          switch (artifactType) {
            case "policy":
              isCompleted = artifact.policy?.status === "published";
              break;
            case "evidence":
              isCompleted = artifact.evidence?.published === true;
              break;
            case "file":
            case "link":
            case "procedure":
            case "training":
              // These artifact types are considered complete if they exist
              isCompleted = true;
              break;
            default:
              isCompleted = false;
          }

          if (isCompleted) {
            progress.completed++;
            progress.byType[artifactType].completed++;
          }
        }

        // Calculate progress percentage
        progress.progress =
          progress.total > 0
            ? Math.round((progress.completed / progress.total) * 100)
            : 0;
      }

      // For controls that weren't found in the database but were requested,
      // check if they have template artifacts from the static data
      for (const controlId of controlIds) {
        const progress = progressByControl.get(controlId);

        // Skip if progress is undefined or the control already has progress data
        if (!progress || progress.total > 0) continue;

        // Find the control template in the static data
        const controlTemplate = controls.find((c) => c.id === controlId);

        if (!controlTemplate) continue;

        // Count artifacts from the template data
        for (const artifact of controlTemplate.mappedArtifacts) {
          const artifactType = artifact.type;

          // Initialize type counters if not exists
          if (!progress.byType[artifactType]) {
            progress.byType[artifactType] = {
              total: 0,
              completed: 0,
            };
          }

          progress.total++;
          progress.byType[artifactType].total++;

          // Template artifacts are not completed by default
          // They're just templates for what needs to be done
        }

        // Calculate progress percentage (will be 0 for template-only controls)
        progress.progress =
          progress.total > 0
            ? Math.round((progress.completed / progress.total) * 100)
            : 0;
      }

      return {
        data: {
          progress: Array.from(progressByControl.values()),
        },
      };
    } catch (error) {
      console.error("Error fetching controls progress:", error);
      return {
        error: "Failed to fetch controls progress",
      };
    }
  });
