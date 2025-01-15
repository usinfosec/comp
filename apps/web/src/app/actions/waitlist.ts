"use server";

import { sendWaitlistEmail } from "@bubba/email/lib/waitlist";
import { createSafeActionClient } from "next-safe-action";
import { Resend } from "resend";
import { waitlistSchema } from "./schema";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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
      await sendWaitlistEmail({ email: parsedInput.email });
    } else {
      throw new Error("Email already in audience");
    }

    return {
      success: true,
    };
  });
