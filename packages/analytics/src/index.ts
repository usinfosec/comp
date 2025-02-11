import posthog from "posthog-js";
import type { Properties } from "posthog-js";

interface AnalyticsConfig {
  apiKey: string;
  apiHost: string;
}

let clientInstance: typeof posthog | null = null;

// Client-side only code
export const Analytics = {
  init: (config: AnalyticsConfig) => {
    if (typeof window === 'undefined') return null;

    if (!clientInstance) {
      posthog.init(config.apiKey, {
        api_host: config.apiHost,
        ui_host: "https://us.posthog.com",
        person_profiles: "always",
        capture_pageview: true,
        capture_pageleave: true,
      });
      clientInstance = posthog;
    }

    return clientInstance;
  },

  track: (eventName: string, properties?: Properties) => {
    if (!clientInstance || typeof window === 'undefined') return;
    clientInstance.capture(eventName, properties);
  },

  identify: (distinctId: string, properties?: Properties) => {
    if (!clientInstance || typeof window === 'undefined') return;
    clientInstance.identify(distinctId, properties);
  },

  reset: () => {
    if (!clientInstance || typeof window === 'undefined') return;
    clientInstance.reset();
  },

  page: (properties?: Properties) => {
    if (!clientInstance || typeof window === 'undefined') return;
    clientInstance.capture('$pageview', properties);
  },
};

// Only export React components for client components
export * from './components/provider';
export * from './components/page-view';
