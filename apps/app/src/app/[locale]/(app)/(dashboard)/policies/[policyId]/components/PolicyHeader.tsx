"use client";

import { StatusPolicies, type StatusType } from "@/components/status-policies";
import type { PolicyStatus } from "@bubba/db";
import { Badge } from "@bubba/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";
import type { PolicyDetails } from "../types";

interface PolicyHeaderProps {
  policy: PolicyDetails;
  saveStatus: "Saved" | "Saving" | "Unsaved";
  wordCount: number;
  status: PolicyStatus;
}

export function PolicyHeader({
  policy,
  saveStatus,
  wordCount,
  status,
}: PolicyHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [policyName, setPolicyName] = useState(policy.policy.name);

  const handleNameChange = (e: React.FocusEvent<HTMLHeadingElement>) => {
    setIsEditing(false);
  };

  const lastUpdated = formatDistanceToNow(new Date(policy.updatedAt), {
    addSuffix: true,
  });

  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-sm w-full">
      <div className="py-4">
        <div className="mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex flex-col">
              {isEditing ? (
                <h1
                  className="text-2xl font-semibold outline-none"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleNameChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                >
                  {policyName}
                </h1>
              ) : (
                <h1
                  className="text-2xl font-semibold cursor-text hover:bg-accent/30"
                  onClick={() => setIsEditing(true)}
                >
                  {policy.policy.name}
                </h1>
              )}
              <div className="flex items-center gap-2 mt-1">
                <StatusPolicies
                  className="text-sm"
                  status={status as StatusType}
                />
              </div>
              <div className="flex flex-row items-center text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 mt-2 sm:mt-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {saveStatus}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {wordCount} words
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
