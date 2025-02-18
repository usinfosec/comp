"use client";

import Tiptap from "@/components/editor/editor";
import { Button } from "@bubba/ui/button";
import { Separator } from "@bubba/ui/separator";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import type { JSONContent } from "novel";
import { toast } from "sonner";
import { usePolicy } from "../hooks/usePolicy";
import { publishPolicy } from "./actions/publish-policy";

export default function PolicyPage() {
  const { id } = useParams();

  const { execute, isExecuting } = useAction(
    () => publishPolicy({ id: id as string }),
    {
      onSuccess: () => {
        toast.success("Policy published successfully");
      },
      onError: () => {
        toast.error("Failed to publish policy, please try again.");
      },
    }
  );

  const { data: policy } = usePolicy({ policyId: id as string });

  console.log({ policy });

  if (!policy) return null;

  const content = policy.content as JSONContent;

  if (!content) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col py-4 gap-4">
      <div className="flex justify-end">
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => execute({ id: id as string })}
        >
          {isExecuting ? "Publishing..." : "Publish"}
        </Button>
      </div>
      <Separator />
      <div className="flex-1">
        <div className="min-h-0 h-auto">
          <div className="relative min-h-[calc(100vh-250px)] w-full  mx-auto border border-border bg-background">
            <Tiptap content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
