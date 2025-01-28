// soc2-seed.ts

"use server";

import { type ArtifactType, db } from "@bubba/db";
import { soc2Categories, soc2Controls } from "../lib/soc2-controls";

export const soc2Seed = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const soc2Framework = await db.framework.findFirst({
    where: {
      name: {
        contains: "SOC 2",
      },
    },
  });

  if (!soc2Framework) {
    const framework = await db.framework.create({
      data: {
        name: "SOC 2",
        description: "SOC 2 Framework",
        version: "2022",
      },
    });

    const categoryMap = new Map();

    for (const category of soc2Categories) {
      const dbCategory = await db.frameworkCategory.create({
        data: {
          name: category.name,
          description: category.description,
          code: category.code,
          frameworkId: framework.id,
        },
      });
      categoryMap.set(category.code, dbCategory.id);
    }

    for (const control of soc2Controls) {
      const categoryId = categoryMap.get(control.categoryId);

      if (!categoryId) {
        throw new Error(`Category ${control.categoryId} not found`);
      }

      await db.control.create({
        data: {
          code: control.code,
          name: control.name,
          description: control.description,
          categoryId: categoryId,
          requiredArtifactTypes:
            control.requiredArtifactTypes as ArtifactType[],
        },
      });
    }

    const controls = await db.control.findMany({
      where: {
        category: {
          frameworkId: framework.id,
        },
      },
    });

    await db.organizationControl.createMany({
      data: controls.map((control) => ({
        organizationId,
        controlId: control.id,
      })),
    });

    await db.organizationFramework.create({
      data: {
        organizationId,
        frameworkId: framework.id,
      },
    });
  }

  const framework = await db.framework.findUnique({
    where: {
      name: "SOC 2",
    },
  });

  if (!framework) {
    throw new Error("SOC 2 Framework not found");
  }
};
