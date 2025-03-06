import image from "./assets/image.png";
import { Logo } from "./assets/logo";

export default {
  name: "Deel",
  id: "deel",
  active: true,
  logo: Logo,
  short_description:
    "Connect your Deel account to Bubba to automate evidence collection for payroll and contractor management",
  description:
    "Integrating with Deel allows you to automate evidence collection for payroll and contractor management. We'll run a daily read-only scan of your resources and store the results in Bubba.",
  images: [image],
  settings: [
    {
      id: "api_key",
      label: "API Key",
      description: "The API key for your Deel account",
      type: "text",
      required: false,
      value: "",
    },
  ],
  config: {},
  category: "HR",
};
