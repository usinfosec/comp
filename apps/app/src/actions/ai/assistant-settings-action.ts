"use server";

import { revalidatePath } from "next/cache";
import { authActionClient } from "../safe-action";
import { assistantSettingsSchema } from "../schema";
import { getAssistantSettings, setAssistantSettings } from "./storage";

export const assistantSettingsAction = authActionClient
  .schema(assistantSettingsSchema)
  .metadata({
    name: "assistant-settings",
  })
  .action(async ({ parsedInput: params, ctx: { user } }) => {
    const settings = await getAssistantSettings();

    if (!user?.organizationId || !user?.id) {
      throw new Error("User not found");
    }

    await setAssistantSettings({
      settings,
      params,
      userId: user.id,
      organizationId: user.organizationId,
    });

    revalidatePath("/account/assistant");

    return params;
  });
