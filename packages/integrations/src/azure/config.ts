// @ts-ignore - Suppress image import warning
import image from "./assets/image.png";
// Import the function directly instead of through integrations
import { fetch } from "./src";

// Type the export directly with inline annotation
const config: {
	name: string;
	id: string;
	active: boolean;
	logo: unknown;
	short_description: string;
	description: string;
	images: unknown[];
	settings: {
		id: string;
		label: string;
		description: string;
		type: string;
		required: boolean;
		value: string;
	}[];
	category: string;
	fetch: any;
} = {
  name: "AZURE",
  id: "azure",
  active: true,
  logo: image,
  short_description:
    "Connect your Azure account to Comp AI to automate evidence collection for cloud resources",
  description:
    "Integrating with Azure allows you to automate evidence collection. This compliance analysis tool enables organizations to more quickly articulate their compliance posture and also generate supporting evidence artifacts",
  images: [image],
  settings: [
    {
      id: "region",
      label: "AZURE region",
      description: "The region of your AWS account",
      type: "text",
      required: true,
      value: "",
    },
    {
      id: "access_key_id",
      label: "AZURE access key ID",
      description: "The API access key ID for your AZURE account",
      type: "text",
      required: true,
      value: "",
    },
    {
      id: "secret_access_key",
      label: "AZURE secret access key",
      description: "The API secret access key for your AZURE account",
      type: "text",
      required: true,
      value: "",
    },
    {
      id: "session_token",
      label: "AZURE session token",
      description: "The API session token AZURE account",
      type: "text",
      required: true,
      value: "",
    },
  ],
  category: "Cloud",
	fetch: fetch
};

export default config;