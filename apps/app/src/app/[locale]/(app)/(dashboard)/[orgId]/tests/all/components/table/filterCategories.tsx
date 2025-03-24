"use client";

import { STATUS_FILTERS, SEVERITY_FILTERS } from "./filterConfigs";

interface FilterCategoriesProps {
  status: string | null;
  setStatus: (status: string | null) => void;
  severity: string | null;
  setSeverity: (severity: string | null) => void;
  setPage: (page: string) => void;
}

export function getFilterCategories({
  status,
  setStatus,
  severity,
  setSeverity,
  setPage,
}: FilterCategoriesProps) {
  return [
    {
      label: "Filter by Status",
      items: STATUS_FILTERS.map((filter) => ({
        ...filter,
        checked: status === filter.value,
        onChange: (checked: boolean) => {
          setStatus(checked ? filter.value : null);
          setPage("1");
        },
      })),
    },
    {
      label: "Filter by Severity",
      items: SEVERITY_FILTERS.map((filter) => ({
        ...filter,
        checked: severity === filter.value,
        onChange: (checked: boolean) => {
          setSeverity(checked ? filter.value : null);
          setPage("1");
        },
      })),
    },
  ];
} 