"use client";

import type { AI } from "@/actions/ai/chat";
import { getUIStateFromAIState } from "@/actions/ai/chat/utils";
import { getChat } from "@/actions/ai/storage";
import { Chat } from "@/components/chat";
import { useAssistantStore } from "@/store/assistant";
import { useAIState, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AssistantFeedback } from "./feedback";
import { Header } from "./header";
import { SidebarList } from "./sidebar-list";

export function Assistant() {
  const { isOpen, setClose } = useAssistantStore();
  const [isExpanded, setExpanded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [chatId, setChatId] = useState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const [aiState, setAIState] = useAIState<typeof AI>();
  const [input, setInput] = useState<string>("");

  const toggleOpen = () => setExpanded((prev) => !prev);

  const onNewChat = () => {
    const newChatId = nanoid();

    setInput("");
    setExpanded(false);
    setAIState((prev) => ({ ...prev, messages: [], chatId: newChatId }));
    setMessages([]);
    setChatId(newChatId as any);
  };

  const handleOnSelect = (id: string) => {
    setExpanded(false);
    setChatId(id as any);
  };

  useHotkeys(
    ["meta+k", "meta+j"],
    (e) => {
      e.preventDefault();
      if (e.key.toLowerCase() === "k") {
        setClose();
      } else {
        onNewChat();
      }
    },
    { enableOnFormTags: true },
  );

  useEffect(() => {
    async function fetchData() {
      const result = await getChat(chatId as any);

      if (result) {
        setAIState((prev) => ({ ...prev, messages: result.messages }));
        setMessages(getUIStateFromAIState(result));
      }
    }

    fetchData();
  }, [chatId]);

  if (!isOpen) return null;

  return (
    <div className="overflow-hidden p-0 h-full w-full md:max-w-[760px] md:h-[480px]">
      {showFeedback && (
        <AssistantFeedback onClose={() => setShowFeedback(false)} />
      )}

      <SidebarList
        onNewChat={onNewChat}
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        onSelect={handleOnSelect}
        chatId={chatId}
      />

      <Header toggleSidebar={toggleOpen} isExpanded={isExpanded} />

      <Chat
        submitMessage={setMessages}
        messages={messages as any}
        user={aiState.user}
        onNewChat={onNewChat}
        setInput={setInput}
        input={input}
        showFeedback={() => setShowFeedback(true)}
      />
    </div>
  );
}
