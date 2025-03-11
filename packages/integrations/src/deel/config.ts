// Don't try to import the image, use a public path
// @ts-ignore
import image from "./assets/image.png";

export default {
  name: "Deel",
  description:
    "Sync your employees from Deel to automatically onboard them in your system.",
  short_description: "Integrate with Deel to sync employee data automatically.",
  id: "deel",
  // Use direct reference to the public image
  logo: image,
  category: "HR",
  active: true,
  // Include both fields and settings for backward compatibility
  settings: [
    {
      id: "api_key",
      label: "API Key",
      description: "Enter your Deel API key",
      type: "text",
      required: true,
      value: "",
    },
  ],
  fields: [
    {
      name: "api_key",
      label: "API Key",
      type: "password",
      required: true,
      placeholder: "Enter your Deel API key",
      description: "You can find your API key in your Deel account settings.",
      encrypted: true,
    },
  ],
  // Add metadata about the integration runs
  metadata: {
    // Define fields for displaying the last run and next run
    lastRun: {
      label: "Last Sync",
      description: "The last time this integration successfully ran",
    },
    nextRun: {
      label: "Next Sync",
      description: "When this integration will run next (every 24 hours)",
    },
  },
  images: [], // Add empty images array for compatibility
};
