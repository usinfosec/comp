"use client";

import React from "react";
import { useEvidenceDashboard } from "../hooks/useEvidenceDashboard";
import { DepartmentBarChart } from "./DepartmentBarChart";
import { AssigneeBarChart } from "./AssigneeBarChart";
import { FrameworkBarChart } from "./FrameworkBarChart";

export const EvidenceOverview = () => {
  const { data, isLoading, error } = useEvidenceDashboard();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Calculate all evidence items by flattening the byDepartment data
  const allEvidence = data?.byDepartment
    ? Object.values(data.byDepartment).flat()
    : [];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Evidence Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <DepartmentBarChart byDepartment={data?.byDepartment} />
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <AssigneeBarChart
              byAssignee={data?.byAssignee}
              allEvidence={allEvidence}
            />
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden md:col-span-2">
          <div className="p-6">
            <FrameworkBarChart byFramework={data?.byFramework} />
          </div>
        </div>
      </div>
    </div>
  );
};
