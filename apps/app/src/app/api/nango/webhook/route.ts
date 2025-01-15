import { db } from "@bubba/db";
import { Nango } from "@nangohq/node";
import type { NextRequest } from "next/server";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const signature = req.headers.get("x-nango-signature");

    if (!signature) {
      return Response.json({ success: false }, { status: 401 });
    }

    const isValid = nango.verifyWebhookSignature(signature, payload);

    if (!isValid) {
      return Response.json({ success: false }, { status: 401 });
    }

    if (payload.type !== "auth" || payload.operation !== "creation") {
      return Response.json(
        {
          error: "Invalid webhook payload",
        },
        { status: 400 },
      );
    }

    const { connectionId, endUser, success } = payload;

    if (!success || !connectionId || !endUser) {
      console.error("Invalid webhook payload:", payload);
      return Response.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    await db.organizationIntegrations.create({
      data: {
        name: payload.provider,
        integration_id: connectionId,
        settings: payload,
        user_settings: {},
        organizationId: endUser.organizationId,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}
