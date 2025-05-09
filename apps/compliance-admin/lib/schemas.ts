import { z } from "zod"
import { Departments, Frequency } from "@comp/data"

// Enum schemas
export const frequencySchema = z.nativeEnum(Frequency)
export const departmentsSchema = z.nativeEnum(Departments)

// Framework schemas
export const frameworkSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
})

export const frameworksSchema = z.record(z.string(), frameworkSchema)

// Requirement schemas
export const requirementSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export const soc2RequirementIdsSchema = z.enum([
  "CC1",
  "CC2",
  "CC3",
  "CC4",
  "CC5",
  "CC6",
  "CC7",
  "CC8",
  "CC9",
  "A1",
  "C1",
  "PI1",
  "P1",
])

export const requirementsSchema = z.record(
  z.string(), // Framework ID
  z.record(z.string(), requirementSchema), // Requirements for that framework
)

// JSON Content schema (for policy content)
export const jsonContentSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      type: z.string().optional(),
      attrs: z.record(z.string(), z.any()).optional(),
      content: z.array(jsonContentSchema).optional(),
      marks: z
        .array(
          z
            .object({
              type: z.string(),
              attrs: z.record(z.string(), z.any()).optional(),
            })
            .passthrough(),
        )
        .optional(),
      text: z.string().optional(),
    })
    .passthrough(),
)

// Policy schemas
export const policyMetadataSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  frequency: frequencySchema,
  department: departmentsSchema,
})

export const policySchema = z.object({
  type: z.literal("doc"),
  metadata: policyMetadataSchema,
  content: z.array(jsonContentSchema),
})

export const policiesSchema = z.record(z.string(), policySchema)

// Task schemas
export const taskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  frequency: frequencySchema,
  department: departmentsSchema,
})

export const tasksSchema = z.record(z.string(), taskSchema)

// Control schemas
export const artifactSchema = z.object({
  type: z.literal("policy"),
  policyId: z.string(),
})

export const requirementReferenceSchema = z.object({
  frameworkId: z.string(),
  requirementId: z.string(),
})

export const taskReferenceSchema = z.object({
  taskId: z.string(),
})

export const controlSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  mappedArtifacts: z.array(artifactSchema),
  mappedRequirements: z.array(requirementReferenceSchema),
  mappedTasks: z.array(taskReferenceSchema),
})

export const controlsSchema = z.array(controlSchema)

// Training video schema
export const trainingVideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  youtubeId: z.string(),
  url: z.string(),
})

export const trainingVideosSchema = z.array(trainingVideoSchema)
