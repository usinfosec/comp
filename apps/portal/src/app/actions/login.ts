"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { auth } from "../lib/auth";

export const login = createSafeActionClient()
  .schema(z.object({
    otp: z.string(),
    email: z.string().email(),
  }))
  .action(async ({ parsedInput }) => {
    await auth.api.signInEmailOTP({
      body: {
        email: parsedInput.email,
        otp: parsedInput.otp,
      },
    });

    return {
      success: true,
    };
  });
