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
import { useOrganizationFramework } from "@/app/[locale]/(app)/(dashboard)/frameworks/[frameworkId]/hooks/useOrganizationFramework";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
        <CardDescription>Review and manage compliance controls</CardDescription>
      </CardHeader>
      <CardContent>
        {organizationCategories.map((category) => (
          <div key={category.id} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
            <DataTable
              data={category.organizationControl.map((control) => ({
                code: control.control.code,
                description: control.control.description,
                name: control.control.name,
                status: control.status,
                id: control.id,
                frameworkId,
              }))}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
