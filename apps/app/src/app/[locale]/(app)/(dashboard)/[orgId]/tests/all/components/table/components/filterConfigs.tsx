import { CheckCircle2, XCircle, Clock } from "lucide-react";

export const STATUS_FILTERS = [
  {
    label: "Passed",
    value: "PASSED",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  },
  {
    label: "Failed",
    value: "FAILED",
    icon: <XCircle className="h-4 w-4 text-red-500" />,
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
    icon: <Clock className="h-4 w-4 text-yellow-500" />,
  },
] as const;

export const SEVERITY_FILTERS = [
  {
    label: "Critical",
    value: "CRITICAL",
    icon: <div className="h-2.5 w-2.5 bg-red-500" />,
  },
  {
    label: "High",
    value: "HIGH",
    icon: <div className="h-2.5 w-2.5 bg-blue-500" />,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    icon: <div className="h-2.5 w-2.5 bg-white border border-gray-200" />,
  },
  {
    label: "Low",
    value: "LOW",
    icon: <div className="h-2.5 w-2.5 bg-gray-500" />,
  },
] as const; 