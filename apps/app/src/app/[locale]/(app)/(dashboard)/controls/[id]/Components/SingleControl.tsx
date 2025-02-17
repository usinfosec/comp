"use client";

import {
  DisplayFrameworkStatus,
  StatusType,
} from "@/components/frameworks/framework-status";
import { useOrganizationControl } from "../hooks/useOrganizationControl";
import { Card } from "@bubba/ui/card";
import { Label } from "@bubba/ui/label";

interface SingleControlProps {
  controlId: string;
}

export const SingleControl = ({ controlId }: SingleControlProps) => {
  const { data: control } = useOrganizationControl(controlId);
  if (!control) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-8 gap-4 flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">{control?.control.name}</h1>
        <DisplayFrameworkStatus
          status={control?.status.toLowerCase() as StatusType}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col gap-2 p-4 px-8 min-h-[200px]">
          <div>
            <Label className="text-lg">Description</Label>
            <p className="text-sm">{control?.control.description}</p>
          </div>
        </Card>
        <Card className="gap-2 p-4 px-8 grid grid-cols-2">
          <div>
            <Label className="text-lg">Code</Label>
            <h1 className="text-sm">{control?.control.code}</h1>
          </div>
          <div>
            <Label className="text-lg">Domain</Label>
            <p className="text-sm">{control?.control.domain}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
