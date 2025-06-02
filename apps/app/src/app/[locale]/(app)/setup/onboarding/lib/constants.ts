import { z } from "zod";
import { Step } from "./types";

export const STORAGE_KEY = "onboarding_answers";

export const companyDetailsSchema = z.object({
	legalName: z.string().min(2, "Company name must be at least 2 characters"),
	website: z.string().url("Please enter a valid URL"),
	identity: z
		.string()
		.min(
			5,
			"Tell us about your identity providers and authentication methods",
		),
	laptopAndMobileDevices: z
		.string()
		.min(5, "Describe your device management and BYOD policies"),
	techStack: z
		.string()
		.min(
			5,
			"List your main technologies, frameworks, and development tools",
		),
	hosting: z
		.string()
		.min(5, "Share details about your cloud providers and infrastructure"),
	vendors: z
		.string()
		.min(5, "List your key service providers and third-party tools"),
	team: z
		.string()
		.min(5, "Describe your team size, structure, and work arrangements"),
	data: z
		.string()
		.min(5, "Tell us about your data types and storage practices"),
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
			"How do your employees log in to company tools? Do you use Google Workspace, Microsoft 365, or something else?",
		placeholder:
			"e.g., We use Google Workspace for email and company tools.",
		options: [
			"Google Workspace",
			"Microsoft 365",
			"Okta",
			"Email/password",
			"Other",
		],
	},
	{
		key: "laptopAndMobileDevices",
		question:
			"What devices do your employees use? Do they use company laptops, their own devices, or both? Do they access work on their phones?",
		placeholder:
			"e.g., We provide MacBooks to everyone. Some people check email on their phones.",
		options: [
			"Company laptops",
			"Personal laptops",
			"Mobile phones",
			"Tablets",
			"Other",
		],
	},
	{
		key: "techStack",
		question:
			"What tools and software do you use to build your product? This helps us understand your security needs.",
		placeholder:
			"e.g., We use Next.js for our website, Python for our backend, and store data in PostgreSQL.",
		options: [
			"Next.js",
			"React",
			"Node.js",
			"Python",
			"Ruby on Rails",
			"PostgreSQL",
			"MongoDB",
			"Other",
		],
	},
	{
		key: "hosting",
		question:
			"Where is your product hosted? Do you use services like Vercel, AWS, or something else?",
		placeholder:
			"e.g., We host our website on Vercel and our database on AWS.",
		options: ["Vercel", "AWS", "GCP", "Azure", "On-premises", "Other"],
	},
	{
		key: "vendors",
		question:
			"What tools does your company use? Think about things like payment processing, communication tools, HR software, etc.",
		placeholder:
			"e.g., We use Stripe for payments, Slack for chat, and Google Workspace for email.",
		options: ["Stripe", "Slack", "Google Workspace", "Salesforce", "Other"],
	},
	{
		key: "team",
		question:
			"How big is your team and how do you work? Are you all in one office, remote, or a mix?",
		placeholder:
			"e.g., We have 5 people working from our office in San Francisco. We have a remote team in London and a few people working from home.",
		options: ["Office", "Remote", "Hybrid"],
	},
	{
		key: "data",
		question:
			"What kind of information do you collect from your customers? Do you store things like names, emails, or payment details?",
		placeholder:
			"e.g., We collect names and email addresses from our customers. We don't store any payment information.",
		options: ["Names", "Emails", "Payment details", "Addresses", "Other"],
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
