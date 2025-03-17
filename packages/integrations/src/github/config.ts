import imageBase64 from "./assets/image.base64";

export default {
  name: "GitHub",
  id: "github",
  active: true,
  logo: imageBase64(),
  short_description:
    "Connect your GitHub account to Bubba to automate evidence collection for cloud resources",
  description:
    "Integrating with GitHub allows you to automate evidence collection for any GitHub repositories you may have, we'll run a daily read-only scan of your repositories and store the results in Bubba.",
  images: [imageBase64()],
  settings: [
    {
      id: "api_key",
      label: "API Key",
      description: "The API key for your GitHub account",
      type: "text",
      required: false,
      value: "",
    },
  ],
  config: {},
  category: "Code",
};
