"use client";

import { closeSession, createAndGetSessionUrl } from "@/actions/ai/session";
import { ChatInput } from "@/components/browser/chat-input";
import { ChatPanel } from "@/components/browser/chat-panel";
import { Button } from "@bubba/ui/button";
import React from "react";
import { useInView } from "react-intersection-observer";

export function Browser() {
  const initialInputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [sessionUrl, setSessionUrl] = React.useState<string | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(false);
  const [initialMessage, setInitialMessage] = React.useState<string | null>(
    null,
  );
  const [isEnding, setIsEnding] = React.useState(false);

  const initializeSession = async () => {
    if (sessionId || isInitializing) return;
    setIsInitializing(true);
    try {
      const { url, sessionId: id } = await createAndGetSessionUrl();
      setSessionUrl(url);
      setSessionId(id);
    } catch (error) {
      console.error("Failed to initialize session:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleInitialSubmit = async (value: string) => {
    setInitialMessage(value);
    await initializeSession();
  };

  const handleExampleClick = async (prompt: string) => {
    setInitialMessage(prompt);
    await initializeSession();
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    setIsEnding(true);
    try {
      await closeSession(sessionId);
      setSessionId(null);
      setSessionUrl(null);
      window.location.reload();
    } catch (error) {
      console.error("Failed to end session:", error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <main className="flex h-[calc(100vh-250px)] flex-col">
      <div className="container h-full flex flex-col">
        {!initialMessage ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Evidence Agent</h1>
            </div>

            <div className="w-full max-w-7xl">
              <ChatInput
                ref={initialInputRef}
                placeholder="Type something here..."
                minRows={3}
                className="max-h-[200px] min-h-[100px] text-base"
                onSubmit={handleInitialSubmit}
                disabled={isInitializing}
                autoFocus
              />
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <ChatPanel
              sessionId={sessionId}
              sessionUrl={sessionUrl}
              initialMessage={initialMessage}
              onEndSession={handleEndSession}
              isEnding={isEnding}
              isInitializing={isInitializing}
            />
          </div>
        )}
      </div>
    </main>
  );
}
