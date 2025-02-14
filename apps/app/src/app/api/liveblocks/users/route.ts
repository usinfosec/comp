import { rateLimit } from "@/lib/rate-limit";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface UserResponse {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

const querySchema = z.object({
  userIds: z.array(z.string().min(1)).min(1).max(100),
});

export async function GET(request: NextRequest) {
  try {
    const limiter = await rateLimit(request);

    if (!limiter.success) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const { searchParams } = new URL(request.url);

    const userIds = searchParams.getAll("userIds");
    const result = querySchema.safeParse({ userIds });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid userIds parameter", details: result.error.format() },
        { status: 400 }
      );
    }

    const users = await Promise.all(
      result.data.userIds.map((id) => getUserWithCache(id))
    );

    const validUsers = users.filter((user): user is UserResponse => user !== null);

    if (validUsers.length === 0) {
      return NextResponse.json(
        { error: "No valid users found" },
        { status: 404 }
      );
    }

    return NextResponse.json(validUsers, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error("[LIVEBLOCKS_USERS]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const getUserWithCache = unstable_cache(
  async (id: string): Promise<UserResponse | null> => {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return user;
  },
  ["user-data"],
  {
    revalidate: 300,
    tags: ["user-data"],
  }
);
