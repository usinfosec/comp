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


        const flattenedControlRelations = controlRelations.flatMap(control => [
            ...control.requirements.map(req => ({
                controlId: control.id,
                requirementId: req.id
            })),
            ...control.policyTemplates.map(policy => ({
                controlId: control.id,
                policyId: policy.id
            })),
            ...control.taskTemplates.map(task => ({
                controlId: control.id,
                taskId: task.id
            }))
        ]);


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

        // Create new control instances
        await tx.control.createMany({
            data: controlTemplates.map(controlTemplate => ({
                name: controlTemplate.name,
                description: controlTemplate.description,
                organizationId: organizationId
            }))
        });

        /**
        |--------------------------------------------------
        | Policies
        |--------------------------------------------------
        */

        await tx.policy.createMany({
            data: policyTemplates.map(policyTemplate => ({
                name: policyTemplate.name,
                description: policyTemplate.description,
                department: policyTemplate.department,
                frequency: policyTemplate.frequency,
                // We're assuming the content is already in the correct format since it's coming from the template.
                content: policyTemplate.content as Prisma.PolicyCreateInput['content'],
                organizationId: organizationId
            }))
        });

        /**
        |--------------------------------------------------
        | Tasks
        |--------------------------------------------------
        */

        await tx.task.createMany({
            data: taskTemplates.map(taskTemplate => ({
                title: taskTemplate.name,
                description: taskTemplate.description,
                organizationId: organizationId
            }))
        });

        // TODO;
        // Add Support for Template Id on all Primitives;
        //// Enable Relational Support for ease of querying.
        // Add Support for Many to Many Task Mapping;
        //// Write SQL to make sure we create relations between existing controls, policies, etc..
        // Enable Relations between static Frameworks/REquirements, and instances and change cascade to PROHIBIT Accidental deeltions.  
        // We will need to do some repairing on production to fix ids that dont conform to the new schema.


        /**
        |--------------------------------------------------
        | Clone and Insert All Relations
        |--------------------------------------------------
        | Framework
        | Control
        | Policy
        | Task
        |--------------------------------------------------
        */

        


        console.log({
            frameworksAndRequirements,
            controlTemplates,
            policyTemplates,
            taskTemplates
        })

        console.log(JSON.stringify({
            flattenedControlRelations
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