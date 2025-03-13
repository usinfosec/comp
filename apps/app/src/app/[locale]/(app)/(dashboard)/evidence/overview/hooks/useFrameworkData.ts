import type { EvidenceWithStatus } from "../actions/getEvidenceDashboard";
import type { StatusType } from "../constants/evidence-status";

/**
 * Interface for the processed framework data
 */
export interface FrameworkData {
  id: string;
  name: string;
  totalItems: number;
  items: EvidenceWithStatus[];
  statusCounts: Record<StatusType, number>;
}

/**
 * Custom hook for framework evidence data processing
 */
export function useFrameworkData() {
  /**
   * Transform raw framework data into a format suitable for charts
   */
  const prepareFrameworkData = (
    byFramework?: Record<string, EvidenceWithStatus[]>
  ): FrameworkData[] => {
    if (!byFramework || Object.keys(byFramework).length === 0) {
      return [];
    }

    const frameworkData: FrameworkData[] = [];

    // Process framework evidence
    for (const [frameworkId, items] of Object.entries(byFramework)) {
      const statusCounts: Record<StatusType, number> = {
        empty: 0,
        draft: 0,
        needsReview: 0,
        upToDate: 0,
      };

      for (const item of items) {
        statusCounts[item.status as StatusType]++;
      }

      frameworkData.push({
        id: frameworkId,
        name: frameworkId,
        totalItems: items.length,
        items,
        statusCounts,
      });
    }

    // Sort by count in descending order
    return frameworkData.sort((a, b) => b.totalItems - a.totalItems);
  };

  return {
    prepareFrameworkData,
  };
}
