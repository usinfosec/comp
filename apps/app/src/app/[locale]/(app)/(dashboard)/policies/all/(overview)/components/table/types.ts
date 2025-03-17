import type { User } from "next-auth";
import type { ReactNode } from "react";

export type PolicyStatus = "published" | "draft" | "needs_review" | "archived";

export interface PoliciesTableProps {
  users: User[];
  ctaButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}
