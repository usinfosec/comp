"use client";

import type { TransformedCategory } from "@/types/framework";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bubba/ui/card";

import { DataTable } from "@/components/tables/frameworks/data-table";
import { useOrganizationCategories } from "@/app/[locale]/(app)/(dashboard)/frameworks/[frameworkId]/hooks/useOrganizationCategories";

interface FrameworkControlsProps {
  frameworkId: string;
}

export function FrameworkControls({ frameworkId }: FrameworkControlsProps) {
  const { data: organizationCategories } =
    useOrganizationCategories(frameworkId);

  if (!organizationCategories) {
    return null;
  }

  const allControls = organizationCategories.flatMap((category) =>
    category.organizationControl.map((control) => ({
      code: control.control.code,
      description: control.control.description,
      name: control.control.name,
      status: control.status,
      id: control.id,
      frameworkId,
      category: category.name,
    }))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
        <CardDescription>Review and manage compliance controls</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable data={allControls} />
      </CardContent>
    </Card>
  );
}
