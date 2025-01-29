"use client";

import type { Artifact } from "@bubba/db";
import type { JSONContent } from "@tiptap/react";
import PolicyEditor from "../editor/advanced-editor";

export function PolicyOverview({ policy }: { policy: Artifact }) {
  const content = policy.content as JSONContent;

  if (!content) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PolicyEditor policyId={policy.id} content={content} />
    </div>
  );
}
