"use server";

import { auth } from "@/auth";
import type { Chat, SettingsResponse } from "./types";

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getAssistantSettings(): Promise<SettingsResponse> {
  const session = await auth();
  const user = session?.user;

  const organizationId = user?.organizationId;
  const userId = user?.id;

  const defaultSettings: SettingsResponse = {
    enabled: true,
  };

  const settings = await redis.get(
    `assistant:${organizationId}:user:${userId}:settings`,
  );

  return {
    ...defaultSettings,
    ...(settings || {}),
  };
}

type SetAassistant = {
  settings: SettingsResponse;
  userId: string;
  organizationId: string;
  params: {
    enabled?: boolean | undefined;
  };
};

export async function setAssistantSettings({
  settings,
  params,
  userId,
  organizationId,
}: SetAassistant) {
  return redis.set(`assistant:${organizationId}:user:${userId}:settings`, {
    ...settings,
    ...params,
  });
}

export async function clearChats({
  organizationId,
  userId,
}: { organizationId: string; userId: string }) {
  const chats: string[] = await redis.zrange(
    `chat:${organizationId}:user:${userId}`,
    0,
    -1,
  );

  const pipeline = redis.pipeline();

  for (const chat of chats) {
    pipeline.del(chat);
    pipeline.zrem(`chat:${organizationId}:user:${userId}`, chat);
  }

  await pipeline.exec();
}

export async function getLatestChat() {
  const settings = await getAssistantSettings();
  if (!settings?.enabled) return null;

  const session = await auth();
  const user = session?.user;

  const organizationId = user?.organizationId;
  const userId = user?.id;

  try {
    const chat: string[] = await redis.zrange(
      `chat:${organizationId}:user:${userId}`,
      0,
      1,
      {
        rev: true,
      },
    );

    const lastId = chat.at(0);

    if (lastId) {
      return redis.hgetall(lastId);
    }
  } catch (error) {
    return null;
  }
}

export async function getChats() {
  const session = await auth();
  const user = session?.user;

  const organizationId = user?.organizationId;
  const userId = user?.id;

  try {
    const pipeline = redis.pipeline();
    const chats: string[] = await redis.zrange(
      `chat:${organizationId}:user:${userId}`,
      0,
      -1,
      {
        rev: true,
      },
    );

    for (const chat of chats) {
      pipeline.hgetall(chat);
    }

    const results = await pipeline.exec();

    return results as Chat[];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string) {
  const session = await auth();
  const user = session?.user;

  const userId = user?.id;

  const chat = await redis.hgetall<Chat>(`chat:${id}`);

  if (!chat || (userId && chat.userId !== userId)) {
    return null;
  }

  return chat;
}

export async function saveChat(chat: Chat) {
  const pipeline = redis.pipeline();
  pipeline.hmset(`chat:${chat.id}`, chat);

  const chatKey = `chat:${chat.organizationId}:user:${chat.userId}`;

  pipeline
    .zadd(chatKey, {
      score: Date.now(),
      member: `chat:${chat.id}`,
    })
    // Expire in 30 days
    .expire(chatKey, 2592000);

  await pipeline.exec();
}
