"use client";

import type { Artifact } from "@bubba/db";
import type { JSONContent } from "novel";
import PolicyEditor from "../editor/advanced-editor";

export function PolicyOverview({ policy }: { policy: Artifact }) {
  const content = JSON.parse(policy.content || "{}");

  if (!content) return null;

  return <PolicyEditor content={content} />;
}
