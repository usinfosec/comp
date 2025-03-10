"use client";

import { useChat as useAIChat } from "@ai-sdk/react";
import { v4 as uuid } from "uuid";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function useChat() {
  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useAIChat({
    api: "/api/chat",
  });

  // Convert AI SDK messages to our ChatMessage format
  const messages: ChatMessage[] = aiMessages.map((msg) => ({
    id: msg.id || uuid(),
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
}
