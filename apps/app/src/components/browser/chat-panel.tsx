"use client";

import { ChatInput } from "@/components/browser/chat-input";
import { ChatMessage } from "@/components/browser/chat-message";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResizablePanel, ResizablePanelGroup } from "@bubba/ui/resizable";
import { useChat } from "ai/react";
import React from "react";
import { useInView } from "react-intersection-observer";

interface ChatPanelProps {
  sessionId: string | null;
  sessionUrl: string | null;
  initialMessage: string | null;
  onEndSession: () => void;
  isEnding: boolean;
  isInitializing: boolean;
}

export function ChatPanel({
  sessionId,
  sessionUrl,
  initialMessage,
  onEndSession,
  isEnding,
  isInitializing,
}: ChatPanelProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const chatInputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  const { messages, input, setInput, handleSubmit, isLoading, data, append } =
    useChat({
      body: { sessionId },
      id: sessionId || undefined,
    });

  const [inViewRef, inView] = useInView({ threshold: 0 });

  const composedScrollRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      messagesEndRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  const isMobile = useIsMobile();

  // Merge `data` into the last assistant message as a status, if any
  const messagesWithStatus = React.useMemo(() => {
    if (!data || !messages) return messages;

    const lastData = data[data.length - 1];
    if (!lastData) return messages;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "assistant") return messages;

    return messages.map((message, index) => {
      if (index === messages.length - 1 && message.role === "assistant") {
        return { ...message, status: lastData };
      }
      return message;
    });
  }, [messages, data]);

  // Send initial message when component mounts
  React.useEffect(() => {
    if (initialMessage && sessionId) {
      append({
        content: initialMessage,
        role: "user",
      });
    }
  }, [sessionId, initialMessage, append]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = React.useCallback(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [shouldAutoScroll]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom =
      Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) <
      50;
    setShouldAutoScroll(isAtBottom);
  };

  return (
    <ResizablePanelGroup
      direction={isMobile ? "vertical" : "horizontal"}
      className="h-[calc(100vh-250px)]"
    >
      <ResizablePanel
        defaultSize={50}
        minSize={30}
        className={`${isMobile ? "order-2 h-[45vh]" : "h-full"}`}
      >
        <div className="flex h-full flex-col p-4">
          <div
            className="flex-1 space-y-4 overflow-y-auto border bg-muted/50 p-4 text-sm scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            onScroll={handleScroll}
          >
            {isInitializing ? (
              <div className="border bg-muted px-3 py-2 text-muted-foreground">
                Initializing browser session...
              </div>
            ) : (
              <>
                {messagesWithStatus?.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="mt-4 pt-2 border-t">
            <ChatInput
              ref={chatInputRef}
              placeholder="Type something here..."
              minRows={2}
              maxRows={4}
              className="max-h-[120px] min-h-[30px] text-sm"
              value={input}
              onValueChange={setInput}
              onSubmit={() => handleSubmit(new Event("submit"))}
              disabled={isLoading || isInitializing || !sessionId}
            />
          </div>
        </div>
      </ResizablePanel>

      <ResizablePanel
        defaultSize={50}
        minSize={30}
        className={`${isMobile ? "order-1 h-[45vh]" : "h-full"}`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="relative flex-1 border bg-muted/50 h-full min-h-full">
            {isInitializing ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Loading browser...</p>
              </div>
            ) : !sessionUrl ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Initializing</p>
              </div>
            ) : (
              <iframe
                src={sessionUrl}
                className="absolute inset-0 h-full w-full"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Browser Session"
              />
            )}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
