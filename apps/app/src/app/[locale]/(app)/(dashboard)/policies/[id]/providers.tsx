"use client";

import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import type { JSONContent } from "novel";
import type { PropsWithChildren } from "react";
import { usePolicy } from "../hooks/usePolicy";

interface ProvidersProps extends PropsWithChildren {
  policyId: string;
}

export function Providers({ children, policyId }: ProvidersProps) {
  const { data: session } = useSession();
  const { data: policy } = usePolicy({ policyId });

  if (!policyId || !session?.user?.organizationId) {
    redirect("/policies");
  }

  const content = policy?.content as JSONContent;
  const roomId = `liveblocks:policies:${session.user.organizationId}:${policyId}`;

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks"
      resolveUsers={async ({ userIds }) => {
        const searchParams = new URLSearchParams(
          userIds.map((userId) => ["userIds", userId]),
        );
        const response = await fetch(`/api/liveblocks/users?${searchParams}`);

        if (!response.ok) {
          throw new Error("Problem resolving users");
        }

        const users = await response.json();
        return users;
      }}
      resolveMentionSuggestions={async ({ text }) => {
        const response = await fetch(
          `/api/liveblocks/users/search?text=${encodeURIComponent(text)}`,
        );

        if (!response.ok) {
          throw new Error("Problem resolving mention suggestions");
        }

        const userIds = await response.json();
        return userIds;
      }}
    >
      <RoomProvider id={roomId} initialStorage={content}>
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
}
