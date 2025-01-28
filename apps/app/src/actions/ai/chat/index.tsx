"use server";

import { auth } from "@/auth";
import { BotMessage, SpinnerMessage } from "@/components/chat/messages";
import { openai } from "@ai-sdk/openai";
import { client as RedisClient } from "@bubba/kv";
import { Ratelimit } from "@upstash/ratelimit";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { startOfMonth, subMonths } from "date-fns";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { getAssistantSettings, saveChat } from "../storage";
import type { AIState, Chat, ClientMessage, UIState } from "../types";

const ratelimit = new Ratelimit({
  limiter: Ratelimit.fixedWindow(10, "10s"),
  redis: RedisClient,
});

export async function submitUserMessage(
  content: string,
): Promise<ClientMessage> {
  "use server";
  const headerList = await headers();

  const ip = headerList.get("x-forwarded-for");
  const session = await auth();

  const { success } = await ratelimit.limit(ip ?? "");

  const aiState = getMutableAIState<typeof AI>();

  if (!success) {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: "assistant",
          content:
            "Not so fast, tiger. You've reached your message limit. Please wait a minute and try again.",
        },
      ],
    });

    return {
      id: nanoid(),
      role: "assistant",
      display: (
        <BotMessage content="Not so fast, tiger. You've reached your message limit. Please wait a minute and try again." />
      ),
    };
  }

  const user = session?.user;
  const organizationId = user?.organizationId as string;

  const defaultValues = {
    from: subMonths(startOfMonth(new Date()), 12).toISOString(),
    to: new Date().toISOString(),
  };

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: openai("gpt-4o-mini"),
    initial: <SpinnerMessage />,
    system: `\
    You are a helpful assistant in Midday who can help users ask questions about their transactions, revenue, spending find invoices and more.

    If the user wants the burn rate, call \`getBurnRate\` function.
    If the user wants the runway, call \`getRunway\` function.
    If the user wants the profit, call \`getProfit\` function.
    If the user wants to find transactions or expenses, call \`getTransactions\` function.
    If the user wants to see spending based on a category, call \`getSpending\` function.
    If the user wants to find invoices or receipts, call \`getInvoices\` function.
    If the user wants to find documents, call \`getDocuments\` function.
    Don't return markdown, just plain text.

    Always try to call the functions with default values, otherwise ask the user to respond with parameters.
    Current date is: ${new Date().toISOString().split("T")[0]} \n
    `,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
        display: null,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
    tools: {},
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export async function handleAIStateChange(state: AIState, done: boolean) {
  "use server";

  const settings = await getAssistantSettings();

  if (!done || !settings?.enabled) return;

  const createdAt = new Date();
  const userId = state.user.id;
  const organizationId = state.user.organizationId;

  const { chatId, messages } = state;

  const firstMessageContent = messages?.at(0)?.content ?? "";
  const title =
    typeof firstMessageContent === "string"
      ? firstMessageContent.substring(0, 100)
      : "";

  const chat: Chat = {
    id: chatId,
    title,
    userId,
    createdAt,
    messages,
    organizationId,
  };

  await saveChat(chat);
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
});
