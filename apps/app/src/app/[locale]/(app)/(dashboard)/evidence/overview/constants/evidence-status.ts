/**
 * Evidence status types and constants
 */

// Status priority and type definitions
export const STATUS_PRIORITY = [
  "upToDate",
  "draft",
  "needsReview",
  "empty",
] as const;
export type StatusType = (typeof STATUS_PRIORITY)[number];

// Status color mapping for UI components
export const STATUS_COLORS = {
  upToDate: "bg-primary",
  draft: "bg-[var(--chart-open)]",
  needsReview: "bg-[hsl(var(--destructive))]",
  empty: "bg-[var(--chart-pending)]",
} as const;

// Status color hex values for charts
export const STATUS_HEX_COLORS: Record<StatusType, string> = {
  upToDate: "#10b981",
  draft: "#f59e0b",
  needsReview: "#ef4444",
  empty: "#6b7280",
};

// Translation keys for evidence statuses
export const STATUS_TRANSLATION_KEYS: Record<StatusType, string> = {
  upToDate: "evidence.status.up_to_date",
  needsReview: "evidence.status.needs_review",
  draft: "evidence.status.draft",
  empty: "evidence.status.empty",
};
