"use client";
import { Alert, AlertDescription } from "@comp/ui/alert";
import { Button } from "@comp/ui/button";
import { ArchiveRestoreIcon } from "lucide-react";
import { format } from "date-fns";
import type { Policy, Member, User } from "@comp/db/types";

interface PolicyStatusAlertsProps {
  policy: (Policy & { approver: (Member & { user: User }) | null }) | null;
  setArchiveOpen: (val: string) => void;
}

export function PolicyStatusAlerts({ policy, setArchiveOpen }: PolicyStatusAlertsProps) {
  if (!policy?.isArchived) return null;
  return (
    <Alert>
      <div className="flex items-center gap-2">
        <ArchiveRestoreIcon className="h-4 w-4" />
        <div className="font-medium">This policy is archived</div>
      </div>
      <AlertDescription>
        Archived on {format(new Date(policy?.updatedAt ?? new Date()), "PPP")}
      </AlertDescription>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setArchiveOpen("true")}
      >
        <ArchiveRestoreIcon className="h-3 w-3" />
        Restore
      </Button>
    </Alert>
  );
}
