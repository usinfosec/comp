"use client";

import { RoomProvider } from "@liveblocks/react/suspense";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import type { ReactNode } from "react";

export function Room({ children }: { children: ReactNode }) {
  const { id: policyId } = useParams();
  const { data: session } = useSession();

  if (!policyId || !session?.user?.organizationId) {
    return redirect("/policies");
  }

  const roomId = `liveblocks:policies:${session.user.organizationId}:${policyId}`;

  return <RoomProvider id={roomId}>{children}</RoomProvider>;
}
