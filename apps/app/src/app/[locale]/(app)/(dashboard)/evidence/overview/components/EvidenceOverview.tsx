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

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Evidence Dashboard</h2>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card text-card-foreground shadow-sm border overflow-hidden h-[400px]">
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">By Department</h3>
            <div className="flex-1">
              <DepartmentBarChart byDepartment={data.byDepartment} />
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground shadow-sm border overflow-hidden h-[400px]">
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">By Assignee</h3>
            <div className="flex-1">
              <AssigneeBarChart
                byAssignee={data.byAssignee}
                unassigned={data.unassigned}
              />
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground shadow-sm border overflow-hidden md:col-span-2 h-[400px]">
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">By Framework</h3>
            <div className="flex-1">
              <FrameworkBarChart byFramework={data.byFramework} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
