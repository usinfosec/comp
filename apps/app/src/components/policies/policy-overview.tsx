"use client";

import type { JSONContent } from "@tiptap/react";
import PolicyEditor from "../editor/advanced-editor";
import { usePolicy } from "@/app/[locale]/(app)/(dashboard)/policies/hooks/usePolicy";

export function PolicyOverview({ policyId }: { policyId: string }) {
  const { data: policy } = usePolicy({ policyId });

  if (!policy) return null;

  const content = policy.content as JSONContent;

  if (!content) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PolicyEditor policyId={policyId} content={content} />
    </div>
  );
}
