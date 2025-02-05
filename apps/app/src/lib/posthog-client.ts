import { env } from "@/env.mjs";
import posthog, { type PostHogConfig } from "posthog-js";

declare module "posthog-js" {
  interface PostHog {
    hasBeenInitialized?: boolean;
  }
}
const posthogConfig: Partial<PostHogConfig> = {
  session_recording: {
    maskAllInputs: false,
    maskInputOptions: {
      password: true,
      color: false,
      date: false,
      'datetime-local': false,
      email: false,
      month: false,
      number: false,
      range: false,
      search: false,
      tel: false,
      text: false,
      time: false,
      url: false,
      week: false,
      textarea: false,
      select: false,
    },
  },
}

if (typeof window !== "undefined") {
  if (!posthog.hasBeenInitialized && env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, posthogConfig);
    posthog.hasBeenInitialized = true;
  }
}

export const initPosthog = () => {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  if (typeof window === "undefined") return;

  if (!posthog.hasBeenInitialized) {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, posthogConfig);
    posthog.hasBeenInitialized = true;
  }
}

export const posthogClient = posthog
