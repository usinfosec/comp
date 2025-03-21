import { z } from "zod";
import type { User } from "next-auth";
import type { ReactNode } from "react";

export const testSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  provider: z.string(),
  status: z.string(),
  resultDetails: z.any(),
  label: z.string().nullable(),
  completedAt: z.date(),
  organizationId: z.string(),
  assignedUserId: z.string(),
  organizationIntegrationId: z.string(),
  TestComments: z.array(z.any())
});

export const testsInputSchema = z.object({
  search: z.string().optional(),
  provider: z.enum(["AWS", "AZURE", "GCP"]).optional(),
  status: z.string().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
});

export type Test = z.infer<typeof testSchema>;
export type TestsInput = z.infer<typeof testsInputSchema>;

export interface TestsResponse {
  tests: {
    id: string;
    severity: string | null;
    result: string;
    title: string;
    provider: string;
    createdAt: Date;
    assignedUser: null;
  }[];
  total: number;
}

export interface AppError {
  code: string;
  message: string;
}

export const appErrors = {
  UNAUTHORIZED: {
    code: "UNAUTHORIZED" as const,
    message: "You are not authorized to view employees",
  },
  UNEXPECTED_ERROR: {
    code: "UNEXPECTED_ERROR" as const,
    message: "An unexpected error occurred",
  },
} as const;


export type TestResult = "PASSED" | "FAILED" | "IN_PROGRESS";
export type TestSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null;

export interface TestRow {
  id: string;
  severity: TestSeverity;
  result: TestResult;
  title: string;
  provider: string;
  createdAt: string | Date; // Allow both string and Date to handle different data formats
  assignedUser: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface TestsTableProps {
  users: User[];
  ctaButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}