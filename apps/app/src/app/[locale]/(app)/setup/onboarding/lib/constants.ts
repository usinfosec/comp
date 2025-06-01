import { z } from "zod";
import { Step } from "./types";

export const STORAGE_KEY = "onboarding_answers";

export const companyDetailsSchema = z.object({
	legalName: z.string().min(2, "Company name must be at least 2 characters"),
	website: z.string().url("Please enter a valid URL"),
	identity: z
		.string()
		.min(
			10,
			"Please provide a detailed description of your company identity stack",
		),
	laptopAndMobileDevices: z
		.string()
		.min(
			10,
			"Please provide a detailed description of your laptop and mobile devices",
		),
	techStack: z
		.string()
		.min(10, "Please provide a detailed description of your tech stack"),
	hosting: z
		.string()
		.min(
			10,
			"Please provide a detailed description of your hosting environment",
		),
	vendors: z
		.string()
		.min(10, "Please provide a detailed description of your vendors"),
	team: z
		.string()
		.min(10, "Please provide a detailed description of your team"),
	data: z
		.string()
		.min(10, "Please provide a detailed description of the data you store"),
});

export const steps: Step[] = [
	{
		key: "legalName",
		question: "What is your company's legal name?",
		placeholder: "e.g., Acme Inc.",
	},
	{
		key: "website",
		question: "What is your company's website URL?",
		placeholder: "e.g., https://www.acme.com",
	},
	{
		key: "identity",
		question:
			"What identity management system do you use? Do you use Single Sign-On (SSO) for your applications?",
		placeholder:
			"e.g., We use Google Workspace for email and JumpCloud as our SSO provider.",
	},
	{
		key: "laptopAndMobileDevices",
		question:
			"What operating systems do you use for company devices? Do employees access company data on mobile devices? Do you have 2FA/MFA enforced??",
		placeholder:
			"e.g., We use macOS for laptops and iOS for mobile devices. Employees can access email and basic company data on their phones. We require 2FA/MFA to access JumpCloud and Google Workspace.",
	},
	{
		key: "techStack",
		question:
			"If you have a web app, what technologies and frameworks does it use? This helps us create relevant security policies and risk assessments.",
		placeholder:
			"e.g., Our stack includes Next.js, Prisma, Tailwind CSS, and various cloud services like Vercel and Upstash.",
	},
	{
		key: "hosting",
		question:
			"Where do you host your applications and data? Do you use cloud providers like AWS, GCP, or Azure?",
		placeholder:
			"e.g., Our applications are hosted on Vercel, and our databases are on DigitalOcean in the EU region.",
	},
	{
		key: "vendors",
		question:
			"Which third-party services, software and vendors does your company use? Try and add as many as possible, e.g. HR tools, payment processors, CRMs, communication tools, etc.",
		placeholder:
			"e.g., We use Stripe for payments, Slack for communication, Google Workspace for email, and various cloud services.",
	},
	{
		key: "team",
		question:
			"What is your team size and work arrangement? Do you have remote, in-office, or hybrid work policies?",
		placeholder:
			"e.g., We have 6 team members working in a hybrid model, with our main office in NYC and remote team members in the UK and Canada.",
	},
	{
		key: "data",
		question:
			"What types of data does your company collect and store? Please include information about data location and sensitivity.",
		placeholder:
			"e.g., We store user names, email addresses, and basic profile information. All data is stored in EU-based servers.",
	},
];

export const welcomeText = [
	"Welcome to Comp AI!",
	"For the best experience, answer the below questions so I can use AI to create your organization in Comp AI.",
	"You'll save 10+ hours of manual work, we'll:",
	"• Update 20+ default policies to be relevant to how you work.",
	"• Automatically create risks and vendors.",
	"Your responses will be securely stored. You can leave this page at any time, your answers will be saved.",
].join("\n\n");
