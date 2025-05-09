// Core enums
export enum Frequency {
  monthly = "monthly",
  quarterly = "quarterly",
  yearly = "yearly",
}

export enum Departments {
  none = "none",
  admin = "admin",
  gov = "gov",
  hr = "hr",
  it = "it",
  itsm = "itsm",
  qms = "qms",
}

// Framework types
export interface Framework {
  name: string
  version: string
  description: string
}

export interface Frameworks {
  soc2: Framework
  // Commented out but kept for type completeness
  // iso27001: Framework;
  // gdpr: Framework;
}

export type FrameworkId = keyof Frameworks

// Requirement types
export interface Requirement {
  name: string
  description: string
}

export type soc2RequirementIds =
  | "CC1"
  | "CC2"
  | "CC3"
  | "CC4"
  | "CC5"
  | "CC6"
  | "CC7"
  | "CC8"
  | "CC9"
  | "A1"
  | "C1"
  | "PI1"
  | "P1"

export type AllRequirementIdsByFramework = {
  soc2: soc2RequirementIds
}

export type SingleFrameworkRequirements<A extends string = string> = Record<A, Requirement>

export type AllRequirements = {
  [K in FrameworkId]: SingleFrameworkRequirements<AllRequirementIdsByFramework[K]>
}

// Policy types
export type JSONContent = {
  [key: string]: any
  type?: string
  attrs?: Record<string, any>
  content?: JSONContent[]
  marks?: {
    type: string
    attrs?: Record<string, any>
    [key: string]: any
  }[]
  text?: string
}

export interface TemplatePolicyMetadata {
  id: string
  slug: string
  name: string
  description: string
  frequency: Frequency
  department: Departments
}

export interface TemplatePolicy {
  type: "doc"
  metadata: TemplatePolicyMetadata
  content: JSONContent[]
}

export type TemplatePolicies = Record<string, TemplatePolicy>
export type TemplatePolicyId = string // We'll use string since we don't have the actual policy keys

// Task types
export interface TemplateTask {
  id: string
  name: string
  description: string
  frequency: Frequency
  department: Departments
}

export type TemplateTaskId = string // We'll use string since we don't have the actual task keys

// Control types
export type TemplateArtifact = {
  type: "policy"
  policyId: TemplatePolicyId
}

export type TemplateRequirement<T extends FrameworkId = FrameworkId> = {
  frameworkId: T
  requirementId: AllRequirementIdsByFramework[T]
}

export interface TemplateControl {
  id: string
  name: string
  description: string
  mappedArtifacts: TemplateArtifact[]
  mappedRequirements: TemplateRequirement[]
  mappedTasks: { taskId: TemplateTaskId }[]
}

// Training video types
export interface TrainingVideo {
  id: string
  title: string
  description: string
  youtubeId: string
  url: string
}

// Type aliases for easier use
export type Control = TemplateControl
export type Task = TemplateTask
export type Policy = TemplatePolicy
