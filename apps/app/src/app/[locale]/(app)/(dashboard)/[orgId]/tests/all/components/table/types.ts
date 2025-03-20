import type { User } from "next-auth";
import type { ReactNode } from "react";

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