"use server";

import { db } from "@comp/db";
import { Prisma } from "@comp/db/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addFrameworksSchema } from "@/actions/schema";

// Duplicating the InitializeOrganizationInput type for clarity, can be shared if preferred
export type AddFrameworksInput = z.infer<typeof addFrameworksSchema>;

/**
 * Adds specified frameworks and their related entities (controls, policies, tasks)
 * to an existing organization. It ensures that entities are not duplicated if they
 * already exist (e.g., from a shared template or a previous addition).
 */
export const addFrameworksToOrganizationAction = async (
	input: AddFrameworksInput,
): Promise<{ success: boolean; error?: string }> => {
	try {
		const validatedInput = addFrameworksSchema.parse(input);
		const { frameworkIds, organizationId } = validatedInput;

		await db.$transaction(async (tx) => {
			// 1. Fetch FrameworkEditorFrameworks and their requirements for the given frameworkIds
			const frameworksAndRequirements = await tx.frameworkEditorFramework.findMany({
				where: {
					id: { in: frameworkIds },
					visible: true, // Only consider visible frameworks
				},
				include: {
					requirements: true,
				},
			});

			if (frameworksAndRequirements.length === 0) {
				throw new Error("No valid or visible frameworks found for the provided IDs.");
			}

			const requirementEditorIds = frameworksAndRequirements.flatMap(
				(framework) => framework.requirements.map((req) => req.id)
			);

			// 2. Fetch all ControlTemplates linked to these requirements
			const controlTemplates = await tx.frameworkEditorControlTemplate.findMany({
				where: {
					requirements: {
						some: {
							id: { in: requirementEditorIds }
						},
					},
				},
			});
			const controlTemplateIds = controlTemplates.map(ct => ct.id);

			// 3. Fetch PolicyTemplates linked to these ControlTemplates
			const policyTemplates = await tx.frameworkEditorPolicyTemplate.findMany({
				where: {
					controlTemplates: {
						some: { id: { in: controlTemplateIds } }
					},
				},
			});
			const policyTemplateIds = policyTemplates.map(pt => pt.id);

			// 4. Fetch TaskTemplates linked to these ControlTemplates
			const taskTemplates = await tx.frameworkEditorTaskTemplate.findMany({
				where: {
					controlTemplates: {
						some: { id: { in: controlTemplateIds } }
					},
				},
			});
			const taskTemplateIds = taskTemplates.map(tt => tt.id);

			// --- Create Instances, Avoiding Duplicates ---

			// 5. Create FrameworkInstances if they don't already exist for the organization
			const existingFrameworkInstances = await tx.frameworkInstance.findMany({
				where: {
					organizationId,
					frameworkId: { in: frameworkIds },
				},
				select: { frameworkId: true },
			});
			const existingFrameworkInstanceIds = new Set(existingFrameworkInstances.map(fi => fi.frameworkId));
			
			const frameworkInstancesToCreate = frameworksAndRequirements
				.filter(f => !existingFrameworkInstanceIds.has(f.id))
				.map(framework => ({
					organizationId: organizationId,
					frameworkId: framework.id
				}));

			if (frameworkInstancesToCreate.length > 0) {
				await tx.frameworkInstance.createMany({
					data: frameworkInstancesToCreate,
				});
			}

			// Fetch all relevant framework instances for the org (newly created + pre-existing for these frameworkIds)
      const allOrgFrameworkInstances = await tx.frameworkInstance.findMany({
        where: { organizationId, frameworkId: { in: frameworkIds } },
        select: { id: true, frameworkId: true },
      });
      const editorFrameworkIdToInstanceIdMap = new Map(
        allOrgFrameworkInstances.map(inst => [inst.frameworkId, inst.id])
      );

			// 6. Create Controls if they don't exist for the organization
			const existingControls = await tx.control.findMany({
				where: {
					organizationId: organizationId,
					controlTemplateId: { in: controlTemplateIds }
				},
				select: { controlTemplateId: true }
			});
			const existingControlTemplateIdsSet = new Set(existingControls.map(c => c.controlTemplateId).filter(id => id !== null) as string[]);
			
			const controlsToCreate = controlTemplates
				.filter(ct => !existingControlTemplateIdsSet.has(ct.id))
				.map(ct => ({
					name: ct.name,
					description: ct.description,
					organizationId: organizationId,
					controlTemplateId: ct.id,
				}));

			if (controlsToCreate.length > 0) {
				await tx.control.createMany({ data: controlsToCreate });
			}
			// Fetch all relevant controls (new and existing)
			const allRelevantControls = await tx.control.findMany({
				where: { organizationId, controlTemplateId: { in: controlTemplateIds } },
				select: { id: true, controlTemplateId: true },
			});
			const controlTemplateIdToInstanceIdMap = new Map(
				allRelevantControls.filter(c => c.controlTemplateId).map(c => [c.controlTemplateId!, c.id])
			);

			// 7. Create Policies if they don't exist for the organization
			const existingPolicies = await tx.policy.findMany({
				where: {
					organizationId: organizationId,
					policyTemplateId: { in: policyTemplateIds }
				},
				select: { policyTemplateId: true }
			});
			const existingPolicyTemplateIdsSet = new Set(existingPolicies.map(p => p.policyTemplateId).filter(id => id !== null) as string[]);

			const policiesToCreate = policyTemplates
				.filter(pt => !existingPolicyTemplateIdsSet.has(pt.id))
				.map(pt => ({
					name: pt.name,
					description: pt.description,
					department: pt.department,
					frequency: pt.frequency,
					content: pt.content as Prisma.PolicyCreateInput['content'],
					organizationId: organizationId,
					policyTemplateId: pt.id
				}));

			if (policiesToCreate.length > 0) {
				await tx.policy.createMany({ data: policiesToCreate });
			}
			const allRelevantPolicies = await tx.policy.findMany({
				where: { organizationId, policyTemplateId: { in: policyTemplateIds } },
				select: { id: true, policyTemplateId: true },
			});
			const policyTemplateIdToInstanceIdMap = new Map(
				allRelevantPolicies.filter(p => p.policyTemplateId).map(p => [p.policyTemplateId!, p.id])
			);

			// 8. Create Tasks if they don't exist for the organization
			const existingTasks = await tx.task.findMany({
				where: {
					organizationId: organizationId,
					taskTemplateId: { in: taskTemplateIds }
				},
				select: { taskTemplateId: true }
			});
			const existingTaskTemplateIdsSet = new Set(existingTasks.map(t => t.taskTemplateId).filter(id => id !== null) as string[]);

			const tasksToCreate = taskTemplates
				.filter(tt => !existingTaskTemplateIdsSet.has(tt.id))
				.map(tt => ({
					title: tt.name,
					description: tt.description,
					organizationId: organizationId,
					taskTemplateId: tt.id
				}));
			if (tasksToCreate.length > 0) {
				await tx.task.createMany({ data: tasksToCreate });
			}
			const allRelevantTasks = await tx.task.findMany({
				where: { organizationId, taskTemplateId: { in: taskTemplateIds } },
				select: { id: true, taskTemplateId: true },
			});
			const taskTemplateIdToInstanceIdMap = new Map(
				allRelevantTasks.filter(t => t.taskTemplateId).map(t => [t.taskTemplateId!, t.id])
			);

			// --- Create Relations ---
			// 9. Get control template relations to requirements, policies, and tasks
			const controlTemplateRelations = await tx.frameworkEditorControlTemplate.findMany({
				where: { id: { in: controlTemplateIds } },
				select: {
					id: true,
					requirements: { where: { id: { in: requirementEditorIds } }, select: { id: true } },
					policyTemplates: { where: { id: { in: policyTemplateIds } }, select: { id: true } },
					taskTemplates: { where: { id: { in: taskTemplateIds } }, select: { id: true } },
				}
			});

			const requirementMapEntriesToCreate: Prisma.RequirementMapCreateManyInput[] = [];

			for (const ctRelation of controlTemplateRelations) {
				const controlInstanceId = controlTemplateIdToInstanceIdMap.get(ctRelation.id);
				if (!controlInstanceId) continue;

				// Create RequirementMap entries
				for (const reqEditor of ctRelation.requirements) {
					// Find which FrameworkEditorFramework this reqEditor.id belongs to
          let frameworkEditorFrameworkIdForReq: string | undefined;
          for (const fw of frameworksAndRequirements) {
            if (fw.requirements.some(r => r.id === reqEditor.id)) {
              frameworkEditorFrameworkIdForReq = fw.id;
              break;
            }
          }
					const frameworkInstanceId = frameworkEditorFrameworkIdForReq ? editorFrameworkIdToInstanceIdMap.get(frameworkEditorFrameworkIdForReq) : undefined;

					if (frameworkInstanceId) {
						requirementMapEntriesToCreate.push({
							controlId: controlInstanceId,
							requirementId: reqEditor.id, // This is FrameworkEditorRequirement.id
							frameworkInstanceId: frameworkInstanceId,
						});
					}
				}

				// Connect Policies to Control instance
				const policyInstanceIdsToConnect = ctRelation.policyTemplates
					.map(pt => policyTemplateIdToInstanceIdMap.get(pt.id))
					.filter(id => id !== undefined) as string[];
				
				if (policyInstanceIdsToConnect.length > 0) {
					await tx.control.update({
						where: { id: controlInstanceId },
						data: { policies: { connect: policyInstanceIdsToConnect.map(id => ({ id })) } },
					});
				}

				// Connect Tasks to Control instance
				const taskInstanceIdsToConnect = ctRelation.taskTemplates
					.map(tt => taskTemplateIdToInstanceIdMap.get(tt.id))
					.filter(id => id !== undefined) as string[];

				if (taskInstanceIdsToConnect.length > 0) {
					await tx.control.update({
						where: { id: controlInstanceId },
						data: { tasks: { connect: taskInstanceIdsToConnect.map(id => ({ id })) } },
					});
				}
			}

			if (requirementMapEntriesToCreate.length > 0) {
				await tx.requirementMap.createMany({
					data: requirementMapEntriesToCreate,
					skipDuplicates: true, // Important for idempotency
				});
			}
		});

		revalidatePath("/"); // Revalidate all paths, or be more specific e.g. /${organizationId}/frameworks
		return { success: true };

	} catch (error) {
		console.error("Error in addFrameworksToOrganizationAction:", error);
		if (error instanceof z.ZodError) {
			return { success: false, error: error.errors.map(e => e.message).join(", ") };
		} else if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "An unexpected error occurred." };
	}
}; 