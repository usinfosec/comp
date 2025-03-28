import { auth } from "@/auth";
import { model, type modelID } from "@/hooks/ai/providers";
import {
	getOrgTool,
	getVendorsTool,
	getPoliciesTool,
	getRisksTool,
	getCloudTestsTool,
	getFrameworkTool,
	getVendorDetailsTool,
	getPolicyDetails,
} from "@/hooks/ai/tools";
import { db } from "@bubba/db";
import { streamText, type UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
	const {
		messages,
		selectedModel,
	}: { messages: UIMessage[]; selectedModel: modelID } = await req.json();

	const session = await auth();

	if (!session?.user.organizationId) {
		return new Response("Unauthorized", { status: 401 });
	}

	const org = await db.organization.findUnique({
		where: {
			id: session.user.organizationId,
		},
	});

	if (!org) {
		return new Response("Organization not found", { status: 404 });
	}

	const systemPrompt = `
    You are an expert in governance, risk, and compliance.

    You're a helpful assistant in Comp AI, a platform that helps companies
    get compliant with frameworks like SOC 2, ISO 27001 and GDPR - similar to Vanta and Drata.

    You have access to various tools to help gather information. You can:
    1. Use multiple tools in sequence to gather comprehensive information
    2. Chain tool calls together to get more detailed information
    3. Use tools to verify or expand upon information from previous tool calls

    When using tools:
    - Start with broader queries to get an overview
    - Then use specific queries to get detailed information
`;

	const result = streamText({
		model: model.languageModel(selectedModel),
		system: systemPrompt,
		messages,
		tools: {
			getOrgTool,
			getVendorsTool,
			getPoliciesTool,
			getRisksTool,
			getCloudTestsTool,
			getFrameworkTool,
			getVendorDetailsTool,
			getPolicyDetails,
		},
	});

	return result.toDataStreamResponse({ sendReasoning: true });
}
