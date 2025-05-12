import { db } from "@comp/db";
import { notFound } from "next/navigation";
import { FrameworkRequirementsClientPage } from "./FrameworkRequirementsClientPage";
import type { FrameworkEditorFramework, FrameworkEditorRequirement } from '@prisma/client';

interface PageProps {
  params: Promise<{
    frameworkId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { frameworkId } = await params;

  const framework = await db.frameworkEditorFramework.findUnique({
    where: {
      id: frameworkId,
    },
    select: {
      id: true,
      name: true,
      version: true,
      description: true,
      requirements: {
        orderBy: {
          name: 'asc'
        },
        include: {
          controlTemplates: true
        }
      }
    }
  });

  if (!framework) {
    notFound();
  }

  
  const { id, name, version, description, requirements } = framework;

  return (
    <FrameworkRequirementsClientPage
      frameworkDetails={{ id, name, version, description }}
      initialRequirements={requirements}
    />
  );
} 