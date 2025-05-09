'use client'

import { createContext, useContext, ReactNode } from 'react'
import type {
  // Frameworks as OriginalFrameworksType, // We'll use Record<string, Framework> now
  // AllRequirements as OriginalAllRequirementsType, // We'll use Record<string, ...> now
  TemplatePolicies,
  TemplateControl,
  TemplateTaskMap,
  Framework as CompDataFramework, // Import the base Framework type
  Requirement as CompDataRequirement // Import the base Requirement type
} from '@comp/data'

export interface InitialData {
  frameworks: Record<string, CompDataFramework> | null
  requirements: Record<string, Record<string, CompDataRequirement>> | null // FrameworkID -> RequirementID -> Requirement
  policies: TemplatePolicies | null // Assuming these remain objects with specific keys for now
  controls: TemplateControl[] | null // This is an array, so it's fine
  tasks: TemplateTaskMap | null // This is a map/record, likely fine
}

interface AppDataContextType {
  appData: InitialData
  isLoading: boolean
  reinitializeData: () => void
  addFramework: (frameworkId: string, framework: CompDataFramework) => void
  updateFramework: (frameworkId: string, frameworkData: Partial<CompDataFramework>) => void
  deleteFramework: (frameworkId: string) => void
  // Generic update function for other data types in the future, if needed
  // updateAppData: <K extends keyof InitialData>(key: K, data: InitialData[K]) => void;
}

// Ensure AppDataContext is exported
export const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

export function useAppData() {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider')
  }
  return context
}

// The AppDataProvider component will be created in the next step
// and will use AppDataContext.Provider 