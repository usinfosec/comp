import { auth } from "@/auth";
import { Liveblocks } from "@liveblocks/node";
import type { NextRequest } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const user = await auth();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const organizationId = user.user?.organizationId;

  if (!organizationId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const session = liveblocks.prepareSession(`${user.user?.id}`, {
    userInfo: {
      name: user.user?.full_name ?? "",
      color: "#000000",
      image: user.user?.avatar_url ?? "",
    },
  });

  session.allow(`liveblocks:policies:${organizationId}:*`, session.FULL_ACCESS);

  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
