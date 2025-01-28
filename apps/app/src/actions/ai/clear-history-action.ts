"use server";

import { authActionClient } from "../safe-action";
import { clearChats } from "./storage";

export const clearHistoryAction = authActionClient
  .metadata({
    name: "clear-history",
  })
  .action(async ({ ctx: { user } }) => {
    if (!user?.organizationId || !user?.id) {
      throw new Error("User not found");
    }

    return clearChats({
      organizationId: user.organizationId,
      userId: user.id,
    });
  });
