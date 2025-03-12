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
	name: "AWS",
	id: "aws",
	active: true,
	logo: image,
	short_description: "Connect your AWS account to Comp AI to automate evidence collection for cloud resources",
	description: "Integrating with AWS allows you to automate evidence collection. This compliance analysis tool enables organizations to more quickly articulate their compliance posture and also generate supporting evidence artifacts",
	images: [image],
	settings: [
		{
			id: "region",
			label: "AWS region",
			description: "The region of your AWS account",
			type: "text",
			required: true,
			value: "",
		},
		{
			id: "access_key_id",
			label: "AWS access key ID",
			description: "The API access key ID for your AWS account",
			type: "text",
			required: true,
			value: "",
		},
		{
			id: "secret_access_key",
			label: "AWS secret access key",
			description: "The API secret access key for your AWS account",
			type: "text",
			required: true,
			value: "",
		},
		{
			id: "session_token",
			label: "AWS session token",
			description: "The API session token AWS account",
			type: "text",
			required: true,
			value: "",
		},
	],
	category: "Cloud",
	fetch: fetch
};

export default config;
