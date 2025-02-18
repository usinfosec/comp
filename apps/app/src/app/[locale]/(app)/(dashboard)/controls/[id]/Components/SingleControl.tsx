"use client";

import {
  DisplayFrameworkStatus,
  type StatusType,
} from "@/components/frameworks/framework-status";
import { useOrganizationControl } from "../hooks/useOrganizationControl";
import { Card } from "@bubba/ui/card";
import { Label } from "@bubba/ui/label";
import { Button } from "@bubba/ui/button";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrganizationControlRequirements } from "../hooks/useOrganizationControlRequirements";
import Link from "next/link";
import { useOrganizationControlProgress } from "../hooks/useOrganizationControlProgress";

interface SingleControlProps {
  controlId: string;
}

export const SingleControl = ({ controlId }: SingleControlProps) => {
  const { data: control } = useOrganizationControl(controlId);
  const { data: requirements } = useOrganizationControlRequirements(controlId);
  const { data: controlProgress } = useOrganizationControlProgress(controlId);
  if (!control || !controlProgress) return null;

  const router = useRouter();

  const progressStatus =
    controlProgress?.progress?.completed > 0
      ? "in_progress"
      : controlProgress?.progress?.completed === 0
        ? "not_started"
        : "completed";

  return (
    <div className="max-w-[1200px] mx-auto py-8 gap-8 flex flex-col">
      <div>
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft size={16} />
          <p>Back</p>
        </Button>
      </div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">{control?.control.name}</h1>
        <DisplayFrameworkStatus status={progressStatus} />
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

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Requirements</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Description</th>
              <th className="text-left p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {requirements?.map((requirement) => {
              const url =
                requirement.type === "policy"
                  ? `/policies/${requirement.organizationPolicy?.policy?.id}`
                  : "_blank";

              const isCompleted =
                requirement.type === "policy"
                  ? requirement.organizationPolicy?.status === "published"
                  : false;

              return (
                <tr
                  key={requirement.id}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                >
                  <td className="p-4">
                    <Link href={url} className="block w-full h-full">
                      {requirement.type}
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link href={url} className="block w-full h-full truncate">
                      {requirement.description}
                    </Link>
                  </td>
                  <td className="p-4 flex items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
