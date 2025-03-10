import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { env } from "@/env.mjs";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key is not configured" }),
      { status: 500 }
    );
  }

  try {
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system:
        "You are a helpful assistant. Provide concise, accurate, and helpful responses to user queries.",
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      { status: 500 }
    );
  }
}
