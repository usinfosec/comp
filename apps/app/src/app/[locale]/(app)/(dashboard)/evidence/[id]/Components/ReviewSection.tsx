"use client";

import type { OrganizationEvidence, Frequency } from "@bubba/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@bubba/ui/card";
import { CalendarClock, Pencil, RefreshCw, Building, User } from "lucide-react";
import { calculateNextReview } from "@/lib/utils/calculate-next-review";
import { format } from "date-fns";
import { FrequencySection } from "./FrequencySection";
import { DepartmentSection } from "./DepartmentSection";
import { AssigneeSection } from "./AssigneeSection";
import { Button } from "@bubba/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toggleRelevance } from "../Actions/toggleRelevance";
import { toast } from "sonner";
import { useOrganizationEvidence } from "../hooks/useOrganizationEvidence";

interface ReviewSectionProps {
  evidence: OrganizationEvidence;
  evidenceId: string;
  lastPublishedAt: Date | null;
  frequency: Frequency | null;
  department: string | null;
  currentAssigneeId: string | null | undefined;
  onSuccess: () => Promise<void>;
  id: string;
}

export function ReviewSection({
  evidenceId,
  lastPublishedAt,
  frequency,
  department,
  currentAssigneeId,
  onSuccess,
  id,
  evidence,
}: ReviewSectionProps) {
  const { mutate } = useOrganizationEvidence({ id });
  const reviewInfo = calculateNextReview(lastPublishedAt, frequency);

  const { execute: toggleRelevanceAction, isExecuting: isTogglingRelevance } =
    useAction(toggleRelevance, {
      onSuccess: () => {
        toast.success("Evidence relevance updated successfully");
        mutate();
      },
      onError: () => {
        toast.error("Failed to update evidence relevance, please try again.");
      },
    });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          Evidence Details
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toggleRelevanceAction({
                id,
                isNotRelevant: !evidence.isNotRelevant,
              })
            }
            disabled={isTogglingRelevance}
            className="text-xs"
          >
            {evidence.isNotRelevant
              ? "Mark as relevant"
              : "Mark as not relevant"}
          </Button>
        </CardTitle>
        <CardDescription className="text-xs">
          Manage review frequency, department assignment, and track upcoming
          review dates
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-2">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex-1 max-w-[150px]">
            <div className="flex items-center gap-2 mb-1.5">
              <Building className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-medium text-muted-foreground">
                DEPARTMENT
              </h3>
            </div>
            <DepartmentSection
              evidenceId={evidenceId}
              currentDepartment={department}
              onSuccess={onSuccess}
            />
          </div>

          <div className="flex-1 max-w-[150px]">
            <div className="flex items-center gap-2 mb-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-medium text-muted-foreground">
                FREQUENCY
              </h3>
            </div>
            <FrequencySection
              evidenceId={evidenceId}
              currentFrequency={frequency}
              onSuccess={onSuccess}
            />
          </div>

          <div className="flex-1 min-w-[180px]">
            <div className="flex items-center gap-2 mb-1.5">
              <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-medium text-muted-foreground">
                NEXT REVIEW
              </h3>
            </div>
            {!reviewInfo ? (
              <p className="text-red-500 font-medium text-sm">ASAP</p>
            ) : (
              <div
                className={`text-sm font-medium ${reviewInfo.isUrgent ? "text-red-500" : ""}`}
              >
                {reviewInfo.daysUntil} days (
                {format(reviewInfo.nextReviewDate, "MM/dd/yyyy")})
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 max-w-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-xs font-medium text-muted-foreground">
              ASSIGNEE
            </h3>
          </div>
          <AssigneeSection
            evidenceId={evidenceId}
            currentAssigneeId={currentAssigneeId}
            onSuccess={onSuccess}
          />
        </div>
      </CardContent>
    </Card>
  );
}
