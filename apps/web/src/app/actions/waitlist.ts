"use server";

import { resend } from "@bubba/email/lib/resend";
import ky from "ky";
import { createSafeActionClient } from "next-safe-action";
import { waitlistSchema } from "./schema";

export const joinWaitlist = createSafeActionClient()
  .schema(waitlistSchema)
  .action(async ({ parsedInput }) => {
    if (!resend) {
      throw new Error("Resend not initialized - missing API key");
    }

    // Existing resend audience
    const audience = await resend.contacts.list({
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    const isInAudience = audience.data?.data?.some(
      (contact: { email: string }) => contact.email === parsedInput.email,
    );

    if (!isInAudience) {
      await resend.contacts.create({
        email: parsedInput.email,
        firstName:
          parsedInput.email.charAt(0).toUpperCase() +
          parsedInput.email.split("@")[0].slice(1),
        audienceId: process.env.RESEND_AUDIENCE_ID as string,
      });

      if (process.env.DISCORD_WEBHOOK_URL) {
        await ky.post(process.env.DISCORD_WEBHOOK_URL as string, {
          json: {
            content: `New waitlist signup: ${parsedInput.email}`,
          },
        });
      }
    } else {
      throw new Error("Email already in audience");
    }

    return {
      success: true,
    };
  });
