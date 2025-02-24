import type { Frequency } from "@bubba/db";

interface ReviewInfo {
  nextReviewDate: Date;
  daysUntil: number;
  isUrgent: boolean;
}

export function calculateNextReview(
  lastPublishedAt: Date | null,
  frequency: Frequency | null,
  urgentThresholdDays = 7
): ReviewInfo | null {
  if (!frequency || !lastPublishedAt) return null;

  const baseDate = new Date(lastPublishedAt);
  const nextReviewDate = new Date(baseDate);

  switch (frequency) {
    case "monthly":
      nextReviewDate.setMonth(nextReviewDate.getMonth() + 1);
      break;
    case "quarterly":
      nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
      break;
    case "yearly":
      nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
      break;
    default:
      return null;
  }

  const daysUntil = Math.ceil(
    (nextReviewDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    nextReviewDate,
    daysUntil,
    isUrgent: daysUntil < urgentThresholdDays,
  };
}
