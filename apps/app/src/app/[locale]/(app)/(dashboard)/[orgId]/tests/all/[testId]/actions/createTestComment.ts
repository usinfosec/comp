"use server";

import { db } from "@bubba/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { createTestCommentSchema } from "./types";

export const createTestCommentAction = authActionClient
  .schema(createTestCommentSchema)
  .metadata({
    name: "create-test-comment",
    track: {
      event: "create-test-comment",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { testId, content } = parsedInput;
    const { user } = ctx;

    if (!user.id || !user.organizationId) {
      throw new Error("Invalid user input");
    }

    await db.organizationIntegrationResultsComments.create({
      data: {
        OrganizationIntegrationResultsId: testId,
        content,
        ownerId: user.id,
        organizationId: user.organizationId,
      },
    });

    revalidatePath(`/${user.organizationId}/tests/${testId}`);
    revalidateTag(`test_${user.organizationId}`);

    return { success: true };
  });
