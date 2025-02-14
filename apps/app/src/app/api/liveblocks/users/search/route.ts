import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const limiter = await rateLimit(request);
    const session = await auth();

    if (!limiter.success) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const organizationId = session.user?.organizationId;

    if (!organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const filteredUserIds = (await getUsers(organizationId))
      .filter((user: any) => {
        return user.name?.toLowerCase().includes(text?.toLowerCase() ?? "");
      })
      .map((user: any) => user.id);

    return NextResponse.json(filteredUserIds, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error("[LIVEBLOCKS_USERS_SEARCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const getUsers = unstable_cache(
  async (organizationId: string) => {
    const users = await db.organizationMember.findMany({
      where: {
        organizationId: organizationId,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    return users;
  },
  ["users-list"],
  {
    revalidate: 300,
    tags: ["users-list"],
  }
);
