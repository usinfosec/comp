import { db } from "@comp/db";
import { Prisma } from "@comp/db/types";


export type InitializeOrganizationInput = {
    frameworkIds: string[]; 
    organizationId: string;
}

export const initializeOrganization = async ({frameworkIds, organizationId}: InitializeOrganizationInput) => {

    const result = await db.$transaction(
        async (tx) => {

            /**
            |--------------------------------------------------
            | Get All Entities
            |--------------------------------------------------
            | Frameworks
            | Requirements
            | Controls
            | Policies
            | Tasks
            |--------------------------------------------------
            */

        // Get all Frameworks and Requirements
        const frameworksAndRequirements = await tx.frameworkEditorFramework.findMany({
            where: {
                id: { in: frameworkIds },
            },
            include: {
                requirements: true
            },
        });
        const requirementIds = frameworksAndRequirements.flatMap(
            (framework) => framework.requirements.map((req) => req.id)
        );

        // Get all Controls Mapped to These Requirements
        const controlTemplates = await tx.frameworkEditorControlTemplate.findMany({
            where: {
                requirements: {
                    some: {
                        id: { in: requirementIds }
                    }
                }
            },
        });
        const controlTemplateIds = controlTemplates.map(control => control.id);

        // Get all policies mapped to these controls
        const policyTemplates = await tx.frameworkEditorPolicyTemplate.findMany({
            where: {
                controlTemplates: {
                    some: { id: { in: controlTemplateIds } }
                }
            },
        });
        const policyTemplateIds = policyTemplates.map(policy => policy.id);


        // Get all tasks mapped to these controls
        const taskTemplates = await tx.frameworkEditorTaskTemplate.findMany({
            where: {
                controlTemplates: {
                    some: { id: { in: controlTemplateIds } }
                }
            },
        });
        const taskTemplateIds = taskTemplates.map(task => task.id);

        /**
        |--------------------------------------------------
        | Get All Relations
        |--------------------------------------------------
        | Controls <> Requirements
        | Controls <> Policies
        | Controls <> Tasks
        |--------------------------------------------------
        */

        // Get all control templates mapped to these policies
        const controlRelations = await tx.frameworkEditorControlTemplate.findMany({
            where: {
                id: { in: controlTemplateIds }
            },
            select: {
                id: true,
                requirements: {
                    where: {
                        id: { in: requirementIds }
                    }
                },
                policyTemplates: {
                    where: {
                        id: { in: policyTemplateIds }
                    }
                },
                taskTemplates: {
                    where: {
                        id: { in: taskTemplateIds }
                    }
                }
            }
        });


        // Create a more intuitive grouped structure for control template relations
        const groupedControlTemplateRelations = controlRelations.map(controlTemplate => ({
            controlTemplateId: controlTemplate.id,
            requirementTemplateIds: controlTemplate.requirements.map(req => req.id),
            policyTemplateIds: controlTemplate.policyTemplates.map(policy => policy.id),
            taskTemplateIds: controlTemplate.taskTemplates.map(task => task.id)
        }));


        /**
        |--------------------------------------------------
        | Clone and Insert All Entities
        |--------------------------------------------------
        | Framework
        | Control
        | Policy
        | Task
        |--------------------------------------------------
        */

        /**
        |--------------------------------------------------
        | Framework
        |--------------------------------------------------
        */

        // Create new framework instances
        await tx.frameworkInstance.createMany({
            data: frameworksAndRequirements.map(framework => ({
                organizationId: organizationId,
                frameworkId: framework.id
            }))
        });

        /**
        |--------------------------------------------------
        | Controls
        |--------------------------------------------------
        */

        // Check for existing controls
        const existingControlsQuery = await tx.control.findMany({
            where: {
                organizationId: organizationId,
                controlTemplateId: { in: controlTemplateIds }
            },
            select: { controlTemplateId: true }
        });
        const existingControlTemplateIdsSet = new Set(existingControlsQuery.map(c => c.controlTemplateId).filter(id => id !== null) as string[]);

        const controlTemplatesForCreation = controlTemplates.filter(
            template => !existingControlTemplateIdsSet.has(template.id)
        );

        if (controlTemplatesForCreation.length > 0) {
            await tx.control.createMany({
                data: controlTemplatesForCreation.map(controlTemplate => ({
                    name: controlTemplate.name,
                    description: controlTemplate.description,
                    organizationId: organizationId,
                    controlTemplateId: controlTemplate.id
                }))
            });
        }

        /**
        |--------------------------------------------------
        | Policies
        |--------------------------------------------------
        */
        // Check for existing policies
        const existingPoliciesQuery = await tx.policy.findMany({
            where: {
                organizationId: organizationId,
                policyTemplateId: { in: policyTemplateIds }
            },
            select: { policyTemplateId: true }
        });
        const existingPolicyTemplateIdsSet = new Set(existingPoliciesQuery.map(p => p.policyTemplateId).filter(id => id !== null) as string[]);

        const policyTemplatesForCreation = policyTemplates.filter(
            template => !existingPolicyTemplateIdsSet.has(template.id)
        );

        if (policyTemplatesForCreation.length > 0) {
            await tx.policy.createMany({
                data: policyTemplatesForCreation.map(policyTemplate => ({
                    name: policyTemplate.name,
                    description: policyTemplate.description,
                    department: policyTemplate.department,
                    frequency: policyTemplate.frequency,
                    content: policyTemplate.content as Prisma.PolicyCreateInput['content'],
                    organizationId: organizationId,
                    policyTemplateId: policyTemplate.id
                }))
            });
        }

        /**
        |--------------------------------------------------
        | Tasks
        |--------------------------------------------------
        */
        // Check for existing tasks
        const existingTasksQuery = await tx.task.findMany({
            where: {
                organizationId: organizationId,
                taskTemplateId: { in: taskTemplateIds }
            },
            select: { taskTemplateId: true }
        });
        const existingTaskTemplateIdsSet = new Set(existingTasksQuery.map(t => t.taskTemplateId).filter(id => id !== null) as string[]);

        const taskTemplatesForCreation = taskTemplates.filter(
            template => !existingTaskTemplateIdsSet.has(template.id)
        );
        if (taskTemplatesForCreation.length > 0) {
            await tx.task.createMany({
                data: taskTemplatesForCreation.map(taskTemplate => ({
                    title: taskTemplate.name,
                    description: taskTemplate.description,
                    organizationId: organizationId,
                    taskTemplateId: taskTemplate.id
                }))
            });
        }

        /**
        |--------------------------------------------------
        | Clone and Insert All Relations
        |--------------------------------------------------
        | Connect Controls to RequirementInstances, Policies, and Tasks
        | based on the previously defined template-level relations.
        | RequirementMap entries will be created here as part of connecting Controls.
        |--------------------------------------------------
        */

        // 1. Fetch all relevant instances (newly created or pre-existing) for this organization
        //    that match the initial template lists.
        const allRelevantControls = await tx.control.findMany({
            where: {
                organizationId: organizationId,
                controlTemplateId: { in: controlTemplateIds } // Use the full list of template IDs
            },
            select: { id: true, controlTemplateId: true }
        });
        const allRelevantPolicies = await tx.policy.findMany({
            where: {
                organizationId: organizationId,
                policyTemplateId: { in: policyTemplateIds } // Use the full list of template IDs
            },
            select: { id: true, policyTemplateId: true }
        });
        const allRelevantTasks = await tx.task.findMany({
            where: {
                organizationId: organizationId,
                taskTemplateId: { in: taskTemplateIds } // Use the full list of template IDs
            },
            select: { id: true, taskTemplateId: true }
        });

        // Fetch FrameworkInstances to get their IDs for RequirementMap creation
        const newFrameworkInstances = await tx.frameworkInstance.findMany({
            where: { organizationId: organizationId, frameworkId: { in: frameworkIds } },
            select: { id: true, frameworkId: true }
        });
        const editorFrameworkIdToInstanceId = new Map(
            newFrameworkInstances.map(inst => [inst.frameworkId, inst.id])
        );

        // 2. Create lookup maps for Controls, Policies, Tasks using all relevant (new or existing) instances
        const controlTemplateIdToInstanceIdMap = new Map(
            allRelevantControls
                .filter(c => c.controlTemplateId != null)
                .map(c => [c.controlTemplateId!, c.id])
        );
        const policyTemplateIdToInstanceIdMap = new Map(
            allRelevantPolicies
                .filter(p => p.policyTemplateId != null)
                .map(p => [p.policyTemplateId!, p.id])
        );
        const taskTemplateIdToInstanceIdMap = new Map(
            allRelevantTasks
                .filter(t => t.taskTemplateId != null)
                .map(t => [t.taskTemplateId!, t.id])
        );
        
        const requirementMapEntriesToCreate: Prisma.RequirementMapCreateManyInput[] = [];

        // 3. Iterate groupedControlTemplateRelations and connect instances,
        // collecting RequirementMap data and connecting tasks/policies in a batched way.
        for (const controlTemplateRelations of groupedControlTemplateRelations) {
            const newControlId = controlTemplateIdToInstanceIdMap.get(controlTemplateRelations.controlTemplateId);

            if (!newControlId) {
                console.warn(`InitializeOrganization: Control instance not found for template ID ${controlTemplateRelations.controlTemplateId}. Skipping relation processing.`);
                continue;
            }

            const updateData: Prisma.ControlUpdateInput = {};
            let needsUpdate = false;

            // --- Process Requirements (Collect data for RequirementMap entries) ---
            if (controlTemplateRelations.requirementTemplateIds.length > 0) {
                for (const reqTemplateId of controlTemplateRelations.requirementTemplateIds) {
                    let frameworkEditorFrameworkIdForReq: string | undefined;
                    for (const fw of frameworksAndRequirements) {
                        if (fw.requirements.some(r => r.id === reqTemplateId)) {
                            frameworkEditorFrameworkIdForReq = fw.id;
                            break;
                        }
                    }
                    const frameworkInstanceId = frameworkEditorFrameworkIdForReq ? editorFrameworkIdToInstanceId.get(frameworkEditorFrameworkIdForReq) : undefined;

                    if (frameworkInstanceId) {
                        requirementMapEntriesToCreate.push({
                            controlId: newControlId, // Direct FK to Control instance
                            requirementId: reqTemplateId, // FK to FrameworkEditorRequirement
                            frameworkInstanceId: frameworkInstanceId, // FK to FrameworkInstance
                        });
                        // No direct update to Control for requirementsMapped here anymore
                    } else {
                        console.warn(`InitializeOrganization: Could not find FrameworkInstanceId for editor requirement ID ${reqTemplateId}. Cannot create RequirementMap for Control ${newControlId}.`);
                    }
                }
                // The actual creation of RequirementMap entries will happen after this loop.
            }

            // --- Process Policies (Connect existing Policy instances) ---
            if (controlTemplateRelations.policyTemplateIds.length > 0) {
                const policiesToConnect = [];
                for (const policyTemplateId of controlTemplateRelations.policyTemplateIds) {
                    const newPolicyId = policyTemplateIdToInstanceIdMap.get(policyTemplateId);
                    if (newPolicyId) {
                        policiesToConnect.push({ id: newPolicyId });
                    } else {
                        console.warn(`InitializeOrganization: Policy instance not found for template ID ${policyTemplateId}. Cannot connect to Control ${newControlId}.`);
                    }
                }
                if (policiesToConnect.length > 0) {
                    updateData.policies = { connect: policiesToConnect };
                    if (Object.keys(updateData).length === 0 && policiesToConnect.length > 0) { needsUpdate = true; }
                }
            }

            // --- Process Tasks (Connect existing Task instances) ---
            if (controlTemplateRelations.taskTemplateIds.length > 0) {
                const tasksToConnect = [];
                for (const taskTemplateId of controlTemplateRelations.taskTemplateIds) {
                    const newTaskId = taskTemplateIdToInstanceIdMap.get(taskTemplateId);
                    if (newTaskId) {
                        tasksToConnect.push({ id: newTaskId });
                    } else {
                        console.warn(`InitializeOrganization: Task instance not found for template ID ${taskTemplateId}. Cannot connect to Control ${newControlId}.`);
                    }
                }
                if (tasksToConnect.length > 0) {
                    updateData.tasks = { connect: tasksToConnect };
                    needsUpdate = true;
                }
            }

            // --- Perform a single update if any relations need to be modified ---
            if (needsUpdate) {
                await tx.control.update({
                    where: { id: newControlId },
                    data: updateData
                });
            }
        }

        // --- Manually insert all collected RequirementMap entries ---
        if (requirementMapEntriesToCreate.length > 0) {
            await tx.requirementMap.createMany({
                data: requirementMapEntriesToCreate,
                skipDuplicates: true // Important for idempotency given the @@unique constraint
            });
        }

        console.log({
            frameworksAndRequirements,
            controlTemplates,
            policyTemplates,
            taskTemplates
        })

        console.log(JSON.stringify({
            groupedControlTemplateRelations // Updated variable name for logging
        }, null, 2))

        return {
            frameworksAndRequirements,
            controlTemplates,
            policyTemplates,
            taskTemplates
        }

    });
    return result;
}