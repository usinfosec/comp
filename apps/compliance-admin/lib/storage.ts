import type { z } from "zod"
import {
  frameworksSchema,
  requirementsSchema,
  controlsSchema,
  policiesSchema,
  tasksSchema,
  trainingVideosSchema,
} from "./schemas"
import { initialData } from "./initial-data"

// Type-safe localStorage get function
export function getFromStorage<T>(key: string, schema: z.ZodType<T>, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue

    const parsed = JSON.parse(item)

    if (parsed === null) {
      console.warn(
        `Retrieved value 'null' for key "${key}" from localStorage. ` +
        `This can happen if "null" was explicitly stored. ` +
        `Returning default value instead of attempting to parse 'null' with the schema.`,
      )
      return defaultValue
    }

    return schema.parse(parsed)
  } catch (error) {
    console.error(`Error retrieving or parsing key "${key}" from localStorage:`, error)
    return defaultValue
  }
}

// Type-safe localStorage set function
export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Initialize storage with default values if empty
export function initializeStorage(): void {
  if (typeof window === "undefined") return

  // Check if data exists in local storage
  const storedFrameworks = localStorage.getItem("frameworks")
  const storedRequirements = localStorage.getItem("requirements")
  const storedControls = localStorage.getItem("controls")
  const storedPolicies = localStorage.getItem("policies")
  const storedTasks = localStorage.getItem("tasks")
  const storedVideos = localStorage.getItem("videos")

  // If any data is missing, initialize with default data
  if (!storedFrameworks) {
    setToStorage("frameworks", initialData.frameworks)
  }
  if (!storedRequirements) {
    setToStorage("requirements", initialData.requirements)
  }
  if (!storedControls) {
    setToStorage("controls", initialData.controls)
  }
  if (!storedPolicies) {
    setToStorage("policies", initialData.policies)
  }
  if (!storedTasks) {
    setToStorage("tasks", initialData.tasks)
  }
  if (!storedVideos) {
    setToStorage("videos", initialData.videos)
  }
}

// Specific getters for each data type
export function getFrameworks() {
  return getFromStorage("frameworks", frameworksSchema, initialData.frameworks)
}

export function getRequirements() {
  return getFromStorage("requirements", requirementsSchema, initialData.requirements)
}

export function getControls() {
  return getFromStorage("controls", controlsSchema, initialData.controls)
}

export function getPolicies() {
  return getFromStorage("policies", policiesSchema, initialData.policies)
}

export function getTasks() {
  return getFromStorage("tasks", tasksSchema, initialData.tasks)
}

export function getTrainingVideos() {
  return getFromStorage("videos", trainingVideosSchema, initialData.videos)
}
